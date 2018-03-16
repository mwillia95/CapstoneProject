﻿using System;
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
            var alerts = DataContext.Alerts.ToList();

            //foreach(var a in alerts)
            //{
            //    var updates = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == a.AlertId);
            //    foreach (var u in updates)
            //        a.Updates.Add(u);
            //}
            foreach (var s in alerts)
            {
                if(s.Status != AlertStatus.Complete)  //want to return only active alerts
                {
                    var aDto = new AlertDto()
                    {
                        AlertId = s.AlertId,
                        Description = s.Description,
                        Status = s.Status.ToString().ToUpper(),
                        Start_Time = String.Format("{0:d/M/yyyy hh:mm:ss tt}", s.Start_Time),
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
                    alert.Updates.Add(u);
                }
            }
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
                ImagePath = path
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
            //need a measureType for what the radius is measured in.....it will either be m (for meters) or km (for kilometers)
            a.Start_Time = DateTime.Now;
            a.Status = AlertStatus.Pending; //3
            DataContext.Alerts.Add(a);
            DataContext.SaveChanges();
            string appPath = HttpContext.Current.Server.MapPath("~");
            string path = sendAlert(new StaticMapRequest(a.location_lat, a.location_lng, a.Zoom, a.Radius, a.AlertId), appPath);
            a.ImageName = path;
            DataContext.SaveChanges();
            return Ok(path);
        }

        [HttpPost]
        [Route("updateAlert")]
        public IHttpActionResult updateAlert(UpdateAlert a)
        {
            a.Start_Time = DateTime.Now;
            if(a.OriginAlert == null)
            {
                a.OriginAlert = DataContext.Alerts.Find(a.OriginAlertRefId);
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
            return Ok(a);
        }

        public string sendAlert(StaticMapRequest s, string rootPath)
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
            response.Dispose();
            stream.Dispose();
            return s.Id + "_map.png";
        }
    }
}