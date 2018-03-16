using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
namespace Capstone_Project_v1.Models
{
    public class StaticMapRequest
    {
        public static readonly int Height = 500;
        public static readonly int Width = 500;
        public static readonly string MapType = "roadmap";
        private static readonly string key = "&key=AIzaSyBjPZkkaFZNUcyiFq6Ckyrcb9LVplllhyE";
        private static readonly string url = "https://maps.googleapis.com/maps/api/staticmap?";
        public decimal Lat { get; set; }
        public decimal Lng { get; set; }
        public decimal Zoom { get; set; }
        public decimal Radius { get; set; }


        public StaticMapRequest()
        {
            Lat = 33.49m;
            Lng = -82.07m;
            Zoom = 8;
            Radius = 10;
        }
        public string toUrlRequest()
        {
            return "https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400&maptype=satellite" + key;
            StringBuilder sb = new StringBuilder();
            sb.Append(url);
            sb.Append("center=");
            sb.Append(Lat + "," + Lng);
            sb.Append("&zoom=");
            sb.Append(Zoom);
            sb.Append("&size=");
            sb.Append(Height + "x" + Width);
            sb.Append("&maptype=");
            sb.Append(MapType);
            sb.Append(key);
            return sb.ToString();
        }
    }
}