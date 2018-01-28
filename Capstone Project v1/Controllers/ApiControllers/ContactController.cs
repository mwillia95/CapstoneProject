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
        DataContext DataContext = new DataContext();

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
            }

            //List<Address> list = DataContext.Addresses.ToList();
            //Address old = list.Where(x => x.City == add.City && x.Street == add.Street && x.Zip == add.Zip && x.State == add.State).ToList()?[0];
            //if (old == null)
            //{
                DataContext.Addresses.Add(add);
                //DataContext.SaveChanges();
                //con.AddressRefId = add.AddressId;
            //}
            //else
            //{
                //con.AddressRefId = old.AddressId;
           // }

            DataContext.Contacts.Add(con);
            DataContext.SaveChanges();

            return Ok(con);
        }
    }
}