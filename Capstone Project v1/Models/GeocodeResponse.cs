using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone_Project_v1.Models
{
    public class GeocodeResponse
    {
        public Result[] results { get; set; }

        public string status { get; set; }
    }

    public class Result
    {
        public object[] address_components { get; set; }
        public string formatted_address { get; set; }
        public Geometry geometry { get; set; }

        public class Geometry
        {
            public Location location { get; set; }

            public class Location
            {
                public decimal lat { get; set; }
                public decimal lng { get; set; }
            }
        }
    }
}