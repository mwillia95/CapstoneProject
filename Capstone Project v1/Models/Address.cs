using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Capstone_Project_v1.Models
{
    [Table("ADDRESS")]
    public class Address
    {
        [Key]
        [Column("ADDRESS_ID")]
        public int AddressId { get; set; }
        [Column("STREET")]
        public string Street { get; set; }
        [Column("STATE")]
        public string State { get; set; }
        [Column("CITY")]
        public string City { get; set; }
        [Column("ZIP")]
        public string Zip { get; set; }

        [Column("LATITUDE")]
        public decimal Latitude { get; set; }
        [Column("LONGITUDE")]
        public decimal Longitude { get; set; }

        public string Searchable()
        {
            return Street + " " + Zip + " " + State + " " + City;
        }
    }
}