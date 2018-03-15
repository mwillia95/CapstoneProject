﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Capstone_Project_v1.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;


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
            var alerts = DataContext.Alerts;
            foreach(var a in alerts)
            {
                var updates = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == a.AlertId);
                foreach (var u in updates)
                    a.Updates.Add(u);
            }
            return Ok(alerts);
        }

        [HttpGet]
        [Route("getAlertById")]
        public IHttpActionResult getAlertById(int id)
        {
            var alert = DataContext.Alerts.Find(id);
            var updates = DataContext.UpdateAlerts.Where(x => x.OriginAlertRefId == alert.AlertId);
            foreach(var u in updates)
            {
                alert.Updates.Add(u);
            }
            return Ok(alert);
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
            a.Status = AlertStatus.Ongoing; //0
            DataContext.Alerts.Add(a);
            DataContext.SaveChanges();
            return Ok(a);
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
    }
}