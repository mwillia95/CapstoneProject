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
        public int Zoom { get; set; }
        public decimal Radius { get; set; }
        public int Id { get; set; }

        public StaticMapRequest(decimal lat, decimal lng, int zoom, decimal radius, int id)
        {
            Lat = lat;
            Lng = lng;
            Zoom = zoom;
            Radius = radius;
            Id = id;
        }
        public string toUrlRequest()
        {
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
            sb.Append("&markers=color:red|");
            sb.Append(Lat + "," + Lng);
            sb.Append(key);
            return sb.ToString();
        }
    }
}