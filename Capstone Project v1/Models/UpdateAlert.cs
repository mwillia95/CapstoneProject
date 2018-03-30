using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/*Idea:
 * When creating an update to an alert, the list of contacts to be notified should be all the contacts notified in the original alert
 * The update should have its own Title and Description
 * The update will also have a time stamp denoting its start time
 * The update will have the primary key of the alert it originated from
 * Note: After the first update, every update after should also have the original alert as its origin, not the previous update
 * The most recent update to an alert can be tracked with either the alerts RecentUpdate variable (or refid) or the most recent timestamp
 * Important: Do not have an alert "include" its update, and also have that update "include" its alert. This would result in circular definition
 */

namespace Capstone_Project_v1.Models
{
    [Table("UPDATE_ALERT")]
    public class UpdateAlert : IEquatable<UpdateAlert>
    {
        [Column("UPDATE_ID")]
        [Key]
        public int UpdateId { get; set; }

        [Column("TITLE")]
        public string Title { get; set; }

        [Column("DESCRIPTION")]
        public string Description { get; set; }

        [Column("START_TIME")]
        public DateTime Start_Time { get; set; }

        [Column("STATUS")]
        public string Status { get; set; }

        [Column("ORIGIN_ALERT_REF_ID")]
        public int OriginAlertRefId { get; set; }

        //Likely not frequently used, but available if necessary
        [ForeignKey("OriginAlertRefId")]
        public virtual Alert OriginAlert { get; set; }

        //retrieve the list of contacts from the original alert
        public ICollection<Contact> getContacts()
        {
            return OriginAlert?.Contacts;
        }

        public UpdateAlert(UpdateAlert a)
        {
            this.Title = a.Title;
            this.Description = a.Description;
            this.OriginAlertRefId = a.OriginAlertRefId;
            this.OriginAlert = a.OriginAlert;
        }

        public UpdateAlert()
        {
        }

        public bool Equals(UpdateAlert a)
        {
            return a?.UpdateId == this?.UpdateId;
        }
    }
}