using System;
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
 * Abstract: AlertController
 * getAlerts: get a list of all alerts
 * getAlertById: get one alert by its id
 * getUpdatesByOriginId: get all updates to one specific alert
 * getUpdateById: get one update by its id
 * addAlert: takes in an alert object, adds it to db
 * updateAlert: takes in an update alert object, adds it to db
 */
namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [RoutePrefix("api/" + AppName + "/accounts")]
    [Authorize]
    public class AlertController : AppApiController
    {
        [HttpGet]
        [Route("getAlerts")]
        public IHttpActionResult getAlerts()
        {
            return Ok(DataContext.Alerts.Include("RecentUpdate"));
        }

        [HttpGet]
        [Route("getAlertById")]
        public IHttpActionResult getAlertById(int id)
        {
            return Ok(DataContext.Alerts.Include("RecentUpdate").First(x => x.AlertId == id));
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

            DataContext.Alerts.Add(a);
            DataContext.SaveChanges();
            return Ok(a);
        }

        [HttpPost]
        [Route("updateAlert")]
        public IHttpActionResult updateAlert(UpdateAlert a)
        {
            DataContext.UpdateAlerts.Add(a);
            DataContext.SaveChanges();
            return Ok(a);
        }
    }
}