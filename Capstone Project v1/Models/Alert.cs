using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Capstone_Project_v1.Models
{
    [Table("ALERT")]
    public class Alert
    {
        [Key]
        [Column("ALERT_ID")]
        public int AlertId { get; set; }

        //These variables likely not needed as long as the contacts notified were stored on alert creation
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


        //to be used as the collection of contacts that were notified in this alert
        public virtual ICollection<Contact> Contacts { get; set; }

        public Alert()
        {
            this.Contacts = new HashSet<Contact>();
        }
    }
}