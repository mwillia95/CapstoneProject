using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone_Project_v1.Models
{
    [Table("ACTIVITY")]
    public class Activity
    {
        [Key]
        [Column("ACTIVITY_ID")]
        public int ActivityId { get; set; }

        [Column("MODULE")]
        public string ModuleName { get; set; }

        [Column("DESCRIPTION")]
        public string Description { get; set; }

        [Column("LOG_TIME")]
        public string LogTime { get; set; }

        public Activity() { }

        public Activity(Alert a, Module m)
        {
            ModuleName = m.ToString().Replace("_"," ");
            Description = $"Created Alert \"{a.Title}\"";
            LogTime = $"{a.Start_Time: MM/dd/yyyy hh:mm tt}";

        }

        public Activity(UpdateAlert a, Module m)
        {
            ModuleName = m.ToString().Replace("_", " ");
            Description = $"{m.ToString().Substring(0, m.ToString().LastIndexOf("_"))} Alert \"{a.Title.Substring(0, a.Title.LastIndexOf(" "))}\"";
            LogTime = $"{a.Start_Time:MM/dd/yyyy hh:mm tt}";
        }

        public Activity(Contact c, Module m)
        {
            ModuleName = m.ToString().Replace("_", " ");
            Description = $"{m.ToString().Substring(0, m.ToString().LastIndexOf("_"))} Contact \"{c.FirstName} {c.LastName}\"";
            LogTime = $"{DateTime.Now: MM/dd/yyyy hh:mm tt}";

        }
            
    }

    public enum Module
    {
        Created_Contact, Updated_Contact, Deleted_Contact, Created_Alert, Updated_Alert, Resolved_Alert
    }
}