using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using Capstone_Project_v1.Models;

namespace Capstone_Project_v1.Controllers.ApiControllers
{
    public class AppApiController : ApiController
    {
        protected const string AppName = "PublicEmergencyNotificationSystem";
        protected readonly DataContext DataContext;

        public AppApiController()
        {
            DataContext = new DataContext();
        }
    }
}