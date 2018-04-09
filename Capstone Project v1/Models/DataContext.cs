using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
//using Capstone_Project_v1.Models.Mapping;

namespace Capstone_Project_v1.Models
{
    public class DataContext : DbContext
    {
        public DataContext()
            :base("name=DefaultConnection")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<UpdateAlert> UpdateAlerts { get; set; }
        public DbSet<Activity> Activities { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>().Property(x => x.Longitude).HasPrecision(13, 10);
            modelBuilder.Entity<Address>().Property(x => x.Latitude).HasPrecision(13, 10);

            base.OnModelCreating(modelBuilder);
        }
    }
}