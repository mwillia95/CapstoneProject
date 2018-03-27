using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Capstone_Project_v1.Models;
using Capstone_Project_v1.Models.DataTransferObjects;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Drawing;
/*
 * getAlerts: get a list of all alerts
 * getAlertById: get one alert by its id
 * getUpdatesByOriginId: get all updates to one specific alert
 * getUpdateById: get one update by its id
 * addAlert: takes in an alert object, adds it to db
 * updateAlert: takes in an update alert object, adds it to db
 * TODO: Method for setting an alert as resolved
 */
namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [RoutePrefix("api/" + AppName + "/alerts")]
    public class AlertController : AppApiController
    {
        [HttpGet]
        [Route("getAlerts")]
        public IHttpActionResult getAlerts()
        {
            List<AlertDto> a = new List<AlertDto>();
            var alerts = DataContext.Alerts.Include("Contacts").ToList();


            //foreach(var a in alerts)
            //{
            //    var updates = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == a.AlertId);
            //    foreach (var u in updates)
            //        a.Updates.Add(u);
            //}
            foreach (var s in alerts)
            {
                if (s.Status != AlertStatus.Complete)  //want to return only active alerts
                {
                    var aDto = new AlertDto()
                    {
                        AlertId = s.AlertId,
                        Description = s.Description,
                        Status = s.Status.ToString().ToUpper(),
                        Start_Time = s.Status != AlertStatus.Pending ? String.Format("{0:d/M/yyyy hh:mm:ss tt}", s.Start_Time) : "STILL PENDING",
                        Title = s.Title,
                        location_lat = s.location_lat,
                        location_lng = s.location_lng,
                        Radius = s.Radius
                    };

                    a.Add(aDto);
                }
            }
            return Ok(a);
        }

        [HttpGet]
        [Route("getAlertById")]
        public IHttpActionResult getAlertById(int id)
        {
            List<object> request = new List<object>();
            var alert = DataContext.Alerts.Find(id);
            alert.Contacts = DataContext.Contacts.Where(x => x.Alerts.Any(y => y.AlertId == id)).ToList();
            var updates = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == alert.AlertId);
            string path;
            if (string.IsNullOrEmpty(alert.ImageName))            //TODO: uncomment when done
            {
                path = "Shrek.jpeg";
            }
            else
            {
                path = alert.ImageName;
            }

            //if (updates != null)
            //{
            //    foreach (var u in updates)
            //    {
            //        alert.Updates.Add(u);
            //    }
            //}
            var aDto = new AlertDto()
            {
                AlertId = alert.AlertId,
                Description = alert.Description,
                Status = alert.Status.ToString().ToUpper(),
                Start_Time = String.Format("{0:d/M/yyyy hh:mm:ss tt}", alert.Start_Time),
                Title = alert.Title,
                location_lat = alert.location_lat,
                location_lng = alert.location_lng,
                Radius = alert.Radius,
                ImagePath = path,
                Contacts = alert.Contacts.ToList()
            };

            request.Add(alert);
            request.Add(aDto);
            return Ok(request);
        }

        [HttpGet]
        [Route("getUpdatesByOriginId")]
        public IHttpActionResult getAlertUpdates(int id)
        {
            List<UpdateAlert> list = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == id).ToList();
            return Ok(list);

            //SendEmailTest();
            //return Ok();
        }

        [HttpGet]
        [Route("getUpdateById")]
        public IHttpActionResult getUpdateById(int id)
        {
            UpdateAlert a = DataContext.UpdateAlerts.Find(id);
            return Ok(a);
        }

        [HttpPost]
        [Route("addAlert")]
        public IHttpActionResult addAlert(Alert a)
        {
            //Pending should only be set if notification doesnt get sent
            //this should be set to Ongoing. Notification should be sent on alert creation
            //still need this functionality
            a.Status = AlertStatus.Pending; //3
            a.Start_Time = DateTime.Now;
            DataContext.Alerts.Add(a);
            DataContext.SaveChanges();
            string appPath = HttpContext.Current.Server.MapPath("~");
            string path = createImage(new StaticMapRequest(a.location_lat, a.location_lng, a.Zoom, a.Radius, a.AlertId), appPath);
            a.ImageName = path;
            DataContext.SaveChanges();


            var contacts = DataContext.Contacts.Include("Address").ToList();
            var contactsToAlert = ContactsInRange(contacts, a.location_lat, a.location_lng, a.Radius);
            a.Contacts = contactsToAlert;
            DataContext.SaveChanges();

            foreach(var c in a.Contacts)
            {
                if (c.ServiceType == "email")
                {
                    SendNotification(c.Email, a.Title, a.Description, c.FirstName + " " + c.LastName, 
                        a, AlertStatus.Ongoing);
                }
                else if(c.ServiceType == "mobile")
                {
                    SendText(a, c.PhoneNumber, AlertStatus.Ongoing);
                }
                else if(c.ServiceType == "both")
                {
                    //need to figure out how to set up the changing of the alertstatus when servicetype is "both"
                    SendNotification(c.Email, a.Title, a.Description, c.FirstName + " " + c.LastName,
                       a, AlertStatus.Ongoing);
                    SendText(a, c.PhoneNumber, AlertStatus.Ongoing);
                }
            }
            if(a.Status == AlertStatus.Pending)
            {
                return Ok("Error sending notifications");
            }
            DataContext.SaveChanges(); //changes the alert status if it was changed
            return Ok();
        }

        [HttpPost]
        [Route("updateAlert")]
        public IHttpActionResult updateAlert(UpdateAlert a)
        {
            a.Start_Time = DateTime.Now;
            if (a.OriginAlert == null)
            {
                a.OriginAlert = DataContext.Alerts.Include("Contacts").First(x => x.AlertId == a.OriginAlertRefId);
                a.OriginAlert.Status = AlertStatus.Updated; //1
            }
            else
            {
                a.OriginAlert.Status = AlertStatus.Updated; //1
            }
            DataContext.UpdateAlerts.Add(a);
            DataContext.SaveChanges();
            //saving the changes will have the context assign the new update its id
            a.OriginAlert.RecentUpdateRefId = a.UpdateId;
            DataContext.SaveChanges();

            var contacts = a.getContacts();

            foreach (var c in contacts)
            {
                if (c.ServiceType == "email" || c.ServiceType == "both")
                {
                    SendNotification(c.Email, a.Title, a.Description, c.FirstName + " " + c.LastName,
                        a.OriginAlert, AlertStatus.Updated);
                }
            }

            return Ok();
        }

        private string createImage(StaticMapRequest s, string rootPath)
        {
            Bitmap image;
            string url = s.toUrlRequest();
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.AutomaticDecompression = DecompressionMethods.GZip;
            string path = rootPath + @"StaticMaps\" + s.Id + "_map.png";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream stream = response.GetResponseStream();
            image = new Bitmap(stream);

            try
            {
                image.Save(path);   
            }
            catch(Exception e)
            {
                return e.Message;
            }

           // image.Save(path);

            response.Dispose();
            stream.Dispose();
            return s.Id + "_map.png";
        }

        private List<Contact> ContactsInRange(List<Contact> contacts, decimal lat, decimal lng, decimal radius)
        {
            List<Contact> newList = new List<Contact>();
            foreach (Contact c in contacts)
            {
                if (InRange(c, lat, lng, radius))
                {
                    newList.Add(c);
                }
            }
            return newList;
        }

        private bool InRange(Contact c, decimal lat, decimal lng, decimal radius)
        {
            var x = c.Address.Latitude;
            var y = c.Address.Longitude;

            var distance = measure((double)x, (double)y, (double)lat, (double)lng);

            return (decimal)distance <= radius;
        }

        private double measure(double lat1, double lon1, double lat2, double lon2)
        {  // generally used geo measurement function

            var R = 6378.137; // Radius of earth in KM
            var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
            var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
            Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c;
            return d * 1000; // meters
        }

        [HttpPost]
        [Route("VerifyContacts")]
        public IHttpActionResult verifyContacts()
        {
            var alerts = DataContext.Alerts.ToList();
            var contacts = DataContext.Contacts.Include("Address").ToList();
            foreach (var a in alerts)
            {
                var contactsToAlert = ContactsInRange(contacts, a.location_lat, a.location_lng, a.Radius);
                DataContext.Alerts.Find(a.AlertId).Contacts = contactsToAlert;
                DataContext.SaveChanges();
            }
            alerts = DataContext.Alerts.ToList();
            foreach(var alert in alerts)
                alert.Contacts = DataContext.Contacts.Where(x => x.Alerts.Any(y => y.AlertId == alert.AlertId)).ToList();
            return Ok(alerts);
        }
    }
}