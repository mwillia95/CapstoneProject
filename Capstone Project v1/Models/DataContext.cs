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
        { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

        }
    }
}