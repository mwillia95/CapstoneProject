using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Capstone_Project_v1.Models
{
    //Variables to assign in JS:
    //Title: Title of the alert (Could be the subject of an email)
    //Description: This is the message that is to be sent out with the alert.
    //Contacts: This should be a collection of the contacts that were notified for the alert.
    //All other variables will be handled by the C# controller
    //location_lat, location_lng, and Radius can be assigned, but will likely be removed unless we decide to stick to only circles
    [Table("ALERT")]
    public class Alert : IEquatable<Alert>
    {
        [Key]
        [Column("ALERT_ID")]
        public int AlertId { get; set; }

        //These variables likely not needed as long as the contacts notified can be stored on alert creation
        //====================================================
        //====================================================
        [Column("CENTER_LAT")]
        public decimal location_lat { get; set; }

        [Column("CENTER_LNG")]
        public decimal location_lng { get; set; }

        [Column("RADIUS")]
        public decimal Radius { get; set; }
        //====================================================
        //====================================================

        [Column("TITLE")]
        public string Title { get; set; }

        [Column("DESCRIPTION")]
        public string Description { get; set; }

        [Column("START_TIME")]
        public DateTime Start_Time { get; set; }

        //Ongiong = 0, Updated = 1, Complete = 2
        [Column("ALERT_STATUS")]
        public AlertStatus Status { get; set; }

        [Column("MEASUREMENT_TYPE")]
        public string MeasureType { get; set; }

        [Column("IMAGE_NAME")]
        public string ImageName { get; set; }
        //Foreign key to the most recent update
        //We could forego this and instead find the update with the most recent timestamp
        [Column("RECENT_UPDATE_REF_ID")]
        public int? UpdateId { get; set; }

        //this property is to be used by the alerts controller to retrieve a specific alert with all of its updates
        [NotMapped]
        public ICollection<UpdateAlert> Updates { get; set; }

        [NotMapped]
        public int Zoom { get; set; }

        //to be used as the collection of contacts that were notified in this alert
        public virtual ICollection<Contact> Contacts { get; set; }

        public Alert()
        {
            
            this.Contacts = new List<Contact>();
            this.Updates = new List<UpdateAlert>();
        }

        public void Copy(Alert a)
        {
            a.Title = this.Title;
            a.Description = this.Description;
            a.Start_Time = this.Start_Time;
            a.Contacts = this.Contacts;
            a.location_lat = this.location_lat;
            a.location_lng = this.location_lng;
            a.Radius = this.Radius;
        }

        public bool Equals(Alert a)
        {
            return a?.AlertId == this?.AlertId;
        }
    }

    public enum AlertStatus
    {
        Ongoing, Updated, Complete, Pending
    }
}