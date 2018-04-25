using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;

namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [Authorize]
    [RoutePrefix("api/" + AppName + "/lists")]
    public class ListController : AppApiController
    {
        [HttpGet]
        [Route("states")]
        public IHttpActionResult GetStates()
        {
            var states = ConfigurationManager.AppSettings["States"].Split(',').ToList();

            return Ok(states);
        }
       
    }
}