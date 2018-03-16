using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone_Project_v1.Models.DataTransferObjects
{
    public class AlertDto
    { 
        public int AlertId { get; set; }
        public decimal location_lat { get; set; }
        public decimal location_lng { get; set; }
        public decimal Radius { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Start_Time { get; set; }
        public string Status { get; set; }
        public string MeasureType { get; set; }
        public string ImagePath { get; set; }
        public List<Contact> Contacts { get; set; }

    }
}