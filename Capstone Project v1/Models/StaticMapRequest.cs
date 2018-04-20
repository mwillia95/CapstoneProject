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
            //sb.Append("&zoom=");
            //sb.Append(Zoom);
            sb.Append("&size=");
            sb.Append(Height + "x" + Width);
            sb.Append("&maptype=");
            sb.Append(MapType);
            sb.Append("&markers=color:red|");
            sb.Append(Lat + "," + Lng);
            sb.Append(key);
            sb.Append("&path=color:red|weight:4|fillcolor:0xFF000080");

            const int r = 6371;
            const double pi = Math.PI;

            var latAux = ((double)Lat * pi) / 180;
            var longAux = ((double)Lng * pi) / 180;
            var d = ((double)Radius / 1000) / r;

            var i = 0;

            if (Radius > 0)
            {
                for (i = 0; i <= 360; i += 8)
                {
                    var brng = i * pi / 180;

                    var pLat = Math.Asin(Math.Sin(latAux) * Math.Cos(d) + Math.Cos(latAux) * Math.Sin(d) * Math.Cos(brng));
                    var pLng = ((longAux + Math.Atan2(Math.Sin(brng) * Math.Sin(d) * Math.Cos(latAux), Math.Cos(d) - Math.Sin(latAux) * Math.Sin(pLat))) * 180) / pi;
                    pLat = (pLat * 180) / pi;
                    sb.Append("|" + pLat + "," + pLng);
                }
            }

            return sb.ToString();
        }
    }
}