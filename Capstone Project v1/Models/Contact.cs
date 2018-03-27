using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Capstone_Project_v1.Models
{
    [Table("CONTACT")]
    public class Contact : IEquatable<Contact>
    {
        [Key]
        [Column("CONTACT_ID")]
        public int ContactId { get; set; }

        [Column("FIRST_NAME")]
        public string FirstName { get; set; }

        [Column("LAST_NAME")]
        public string LastName { get; set; }

        [EmailAddress]
        [Column("EMAIL")]
        public string Email { get; set; }

        [Phone]
        [Column("PHONE_NUMBER")]
        public string PhoneNumber { get; set; }

        [Column("SERVICE_TYPE")]
        public string ServiceType { get; set; }

        [Column("ADDRESS_ID")]
        public int AddressId { get; set; }

        [ForeignKey("AddressId")]
        public virtual Address Address { get; set; }

        //used in conjunction with the Contacts property in the Alert class to create a M-N relation
        //this way, an alert can retrieve all contacts it notified
        //can also be used to retrieve all the alerts sent to a specific contact
        public virtual ICollection<Alert> Alerts { get; set; }

        public Contact()
        {
            this.Alerts = new List<Alert>();
        }
        public string Searchable()
        {
            return (FirstName + " " + LastName + " " + Email + " " + PhoneNumber + " " + Address.Searchable()).ToLower();
        }

        public bool Equals(Contact c)
        {
            if (c == null || this == null)
                return false;
            return c.ContactId == this.ContactId;
        }
    }
}