using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Capstone_Project_v1.Models;
namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [RoutePrefix("api/" + AppName + "/contacts")]
    public class ContactController : AppApiController
    {
        [HttpPost]
        [Route("addContact")]
        public IHttpActionResult AddNewContact(Contact c)
        {
            Address a = c.Address;
            var add = new Address();
            {
                add.City = a.City;
                add.Street = a.Street;
                add.Zip = a.Zip;
                add.State = a.State;
            }

            var con = new Contact();
            {
                con.FirstName = c.FirstName;
                con.LastName = c.LastName;
                con.PhoneNumber = c.PhoneNumber;
                con.Email = c.Email;
                con.Address = add;
                con.ServiceType = c.ServiceType;
            }
            List<Address> list = DataContext.Addresses.ToList();
            List<Address> old = list.Where(x => x.City == add.City && x.Street == add.Street && x.Zip == add.Zip && x.State == add.State).ToList();
            if (old != null && old.Count > 0)
            {
                con.Address = old[0];
            }
            DataContext.Contacts.Add(con);
            DataContext.SaveChanges();

            return Ok(con);
        }

        [HttpGet]
        [Route("getContacts")]
        public IHttpActionResult GetContacts()
        {
            var item = DataContext.Contacts.Include("Address");
            return Ok(item);
        }
    }
}