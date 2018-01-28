using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Capstone_Project_v1.Models
{
    [Table("CONTACT")]
    public class Contact
    {
        [Column("CONTACT_ID")]
        [Required]
        [Key]
        public int ContactId { get; set; }

        [Column("FIRST_NAME")]
        public string FirstName { get; set; }

        [Column("LAST_NAME")]
        public string LastName { get; set; }

        [Column("EMAIL")]
        [EmailAddress]
        public string Email { get; set; }

        [Column("PHONE")]
        [Phone]
        public string PhoneNumber { get; set; }

        public Address Address { get; set; }
    }
}