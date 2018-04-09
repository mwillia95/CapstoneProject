using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [RoutePrefix("api/" + AppName + "/activity")]
    public class ActivityController : AppApiController
    {
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetActivityLog()
        {
            var activities = DataContext.Activities.ToList();
            return Ok(activities);
        }

    }
}