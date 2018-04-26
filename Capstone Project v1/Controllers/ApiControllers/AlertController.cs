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
    [Authorize]
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
                        Start_Time = s.Status != AlertStatus.Pending ? String.Format("{0:MM/dd/yyyy hh:mm tt}", s.Start_Time) : "STILL PENDING",
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
        [Route("getResolvedAlerts")]
        public IHttpActionResult getResolvedAlerts()
        {
            var alerts = DataContext.Alerts;
            var updates = DataContext.UpdateAlerts;

            var uQuery = (from u in updates
                          from a in alerts
                          where u.UpdateId == a.UpdateId && u.Status == "RESOLVED"
                          select new { a.AlertId, a.Start_Time, End = u.Start_Time, a.Title }).ToList();
           
            var resAlerts = new List<ResolvedAlertDto>();
            foreach (var a in uQuery)
            {
                var r = new ResolvedAlertDto()
                {
                    AlertId = a.AlertId,
                    Start_Time = a.Start_Time.ToString(),
                    End_Time = a.End.ToString(),
                    Title = a.Title
                };

                resAlerts.Add(r);

            }
            return Ok(resAlerts);
        }

        [HttpGet]
        [Route("getAlertById")]
        public IHttpActionResult getAlertById(int id)       //this is for the update page. Finds the correct alert to display
        {
            List<UpdateAlertDto> updateList = new List<UpdateAlertDto>(); //for update DTOS for formatting stuff for table
            List<object> request = new List<object>();
            var alert = DataContext.Alerts.Find(id);
            alert.Contacts = DataContext.Contacts.Include("Address").Where(x => x.Alerts.Any(y => y.AlertId == id)).ToList();
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

            if (updates != null)
           {
               foreach (var u in updates)
                {
                    u.OriginAlert = null;
                    alert.Updates.Add(u);

                    var updateDto = new UpdateAlertDto()
                    {
                        UpdateId = u.UpdateId,
                        Title = u.Title,
                        Description = u.Description,
                        Update_Time = String.Format("{0:MM/dd/yyyy hh:mm tt}", u.Start_Time),
                        Status = u.Status == null ? "UPDATED" : u.Status.ToUpper()                                                               
                     };

                    updateList.Add(updateDto);
                }
            }
            var aDto = new AlertDto()
            {
                AlertId = alert.AlertId,
                Description = alert.Description,
                Status = alert.Status.ToString().ToUpper(),
                Start_Time = String.Format("{0:MM/dd/yyyy hh:mm tt}", alert.Start_Time),
                Title = alert.Title,
                location_lat = alert.location_lat,
                location_lng = alert.location_lng,
                Radius = alert.Radius,
                ImagePath = path,
                Contacts = alert.Contacts.ToList()
            };       

            request.Add(alert);
            request.Add(aDto);
            if(updateList.Count > 0)
            {
                request.Add(updateList);
            }
            return Ok(request);
        }

        [HttpGet]
        [Route("getUpdatesByOriginId")]
        public IHttpActionResult getAlertUpdates(int id)
        {
            List<UpdateAlert> list = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == id).ToList();
            return Ok(list);
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
            a.Status = AlertStatus.Ongoing; //3
            a.Start_Time = DateTime.Now;
            DataContext.Alerts.Add(a);
            DataContext.SaveChanges();
            string appPath = HttpContext.Current.Server.MapPath("~");
            string path = createImage(new StaticMapRequest(a.location_lat, a.location_lng, a.Zoom, a.Radius, a.AlertId), appPath);
            if(path == "ERROR")
            {
                return InternalServerError();
            }
            a.ImageName = path;
            DataContext.SaveChanges();


            var contacts = DataContext.Contacts.Include("Address").ToList();
            var contactsToAlert = ContactsInRange(contacts, a.location_lat, a.location_lng, a.Radius);
            a.Contacts = contactsToAlert;
            DataContext.SaveChanges();

            int count = SendNotifications(a.Contacts.ToList(), a);

            DataContext.SaveChanges(); //changes the alert status if it was changed

            //adds this activiy to activity log
            var activity = new Activity(a, Module.Created_Alert);
            DataContext.Activities.Add(activity);
            DataContext.SaveChanges();

            return Ok(count);
        }

        [HttpPost]
        [Route("updateAlert")]
        public IHttpActionResult updateAlert(UpdateAlert a)
        {
            a.Start_Time = DateTime.Now;
            if (a.OriginAlert == null)
            {
                a.OriginAlert = DataContext.Alerts.Include("Contacts").First(x => x.AlertId == a.OriginAlertRefId);
            }
            AlertStatus type;
            if (a.Status == "UPDATE" || a.Status == "UPDATED")
                type = AlertStatus.Updated;
            else if (a.Status == "RESOLVED")
                type = AlertStatus.Complete;
            else
                type = AlertStatus.Ongoing; //should not be hit typically, error handling

            DataContext.UpdateAlerts.Add(a);
            DataContext.SaveChanges();
            //saving the changes will have the context assign the new update its id
            a.OriginAlert.UpdateId = a.UpdateId;
            DataContext.SaveChanges();
            var contacts = a.getContacts().ToList();
            int count = SendNotifications(a.getContacts().ToList(), a);


            a.OriginAlert.Status = type;

            DataContext.SaveChanges(); //changes the alert status if it was changed

            //Adds this activity to action log
            if (a.Status == "UPDATED")
            {
                var activity = new Activity(a, Module.Updated_Alert);
                DataContext.Activities.Add(activity);
                DataContext.SaveChanges();
            }
            else if (a.Status == "RESOLVED")
            {
                var activity = new Activity(a, Module.Resolved_Alert);
                DataContext.Activities.Add(activity);
                DataContext.SaveChanges();
            }

            return Ok(count);
        }

        [HttpGet]
        [Route("activityLog")]
        public IHttpActionResult GetActivityLog()
        {
            var activities = DataContext.Activities.ToList().OrderByDescending(x => x.ActivityId);
            return Ok(activities);
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
                return "ERROR";
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
            var R = 6371; // Radius of the earth in km
            var dLat = ToRadians(lat2 - lat1);  // deg2rad below
            var dLon = ToRadians(lon2 - lon1);
            var z = Math.Sin(dLat / 2) * Math.Sin(dLat / 2);
            var w = Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var a = z + w;               
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return (d * 1000);
        }

        private double ToRadians(double deg)
        {
            return deg * (Math.PI / 180);
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