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
        [Route("getContacts/{search}")]
        public IHttpActionResult GetContacts(string search)
        {
            //split the search into individual terms
            var terms = search.Split(' ');
            var list = DataContext.Contacts.Include("Address").ToList();
            var items = new List<Contact>();

            //return an item if every term appears in the contact somewhere
            foreach(var c in list)
            {
                bool valid = true;
                var searchable = c.Searchable();
                foreach(var t in terms)
                {
                    if (!searchable.Contains(t))
                    {
                        valid = false;
                        break;
                    }
                }
                if (valid)
                    items.Add(c);
            }

            //var item = DataContext.Contacts.Include("Address").Where(x => x.FirstName.Contains(search) || x.LastName.Contains(search) || x.PhoneNumber.Contains(search)
            //        || x.Email.Contains(search) || x.ServiceType.Contains(search) || x.Address.City.Contains(search) || x.Address.State.Contains(search) || x.Address.Street.Contains(search)
            //        || x.Address.Zip.Contains(search));
                       
                
            return Ok(items);
        }


        [HttpGet]
        [Route("getContactsAll")]
        public IHttpActionResult GetContactsAll()
        {
            var item = DataContext.Contacts.Include("Address");
            return Ok(item);
        }

        [HttpPost]
        [Route("updateContact")]
        public IHttpActionResult UpdateContact(Contact c)
        {
            var old = DataContext.Contacts.Find(c.ContactId);
            {
                //TODO: Make sure if the address changes for one person, it does not change the address for everyone who used to have that address
                //This will likely mean checking if a new address needs to be made
                old.Address = c.Address;
                old.Email = c.Email;
                old.PhoneNumber = c.PhoneNumber;
                old.FirstName = c.FirstName;
                old.LastName = c.LastName;
            }
            DataContext.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("removeContact")]
        public IHttpActionResult RemoveContact(Contact c)
        {
            var old = DataContext.Contacts.Find(c.ContactId);
            DataContext.Contacts.Remove(old);
            DataContext.SaveChanges();
            return Ok();
        }
    }
}