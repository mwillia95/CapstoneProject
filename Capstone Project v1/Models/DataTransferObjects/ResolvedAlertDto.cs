using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Capstone_Project_v1.Models.DataTransferObjects
{
    public class ResolvedAlertDto
    {
        public int AlertId { get; set; }
        public string Title { get; set; }
        public string Start_Time { get; set; }
        public string End_Time { get; set; }

        //public ResolvedAlertDto(Alert a)
        //{
        //    AlertId = a.AlertId;
        //    Title = a.Title;
        //    Start_Time = $"{a.Start_Time: MM/dd/yyyy hh:mm tt}";
        //    End_Time = $"{a.Updates.Last(): MM/dd/yyy hh:mm tt}";
        //}      
    }
}