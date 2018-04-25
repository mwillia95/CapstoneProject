using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Capstone_Project_v1.Models;
using System.Net;
using System.IO;
using Newtonsoft.Json;
namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [Authorize]
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
                add.Latitude = a.Latitude;
                add.Longitude = a.Longitude;
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
            List<Address> old = list.Where(x => x.City == add.City && x.Street == add.Street && x.Zip == add.Zip && x.State == add.State && x.Latitude == add.Latitude
                && x.Longitude == add.Longitude).ToList();
            if (old != null && old.Count > 0)
            {
                con.Address = old[0];
            }
            DataContext.Contacts.Add(con);
            DataContext.SaveChanges();

            var activity = new Activity(c, Module.Created_Contact);
            DataContext.Activities.Add(activity);
            DataContext.SaveChanges();

            return Ok(con);
           
        }

        //run the lat-long assignment on all addresses
        //call this method to reassign lat long values to addresses in the database
        [HttpPost]
        [Route("verifyLatLong")]
        public IHttpActionResult LatLongCheck()
        {
            List<Address> addresses = DataContext.Addresses.ToList();
            List<Address> Converted = new List<Address>();
            foreach(Address a in addresses)
            {
                string address = a.Street + ", " + a.City + ", " + a.State;
                address = address.Replace(' ', '+');
                string html = "";
                string url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBjPZkkaFZNUcyiFq6Ckyrcb9LVplllhyE";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.AutomaticDecompression = DecompressionMethods.GZip;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    html = reader.ReadToEnd();
                }
                var result = JsonConvert.DeserializeObject<GeocodeResponse>(html);
                if (result.status == "ZERO_RESULTS")
                    continue;
                var lat = result.results[0].geometry.location.lat;
                var lng = result.results[0].geometry.location.lng;
                a.Latitude = lat;
                a.Longitude = lng;
                Converted.Add(a);
            }
            DataContext.SaveChanges();
            return Ok(Converted);

        }

        [HttpGet]
        [Route("getContactById")]
        public IHttpActionResult GetContactById(int id)
        {
            //If I'm not mistaken, .Where will search through every database entry, while .Find will use hash tables for constant-time lookup
            //var contact = DataContext.Contacts.Include("Address").Where(x => x.ContactId == id);
            var contact = DataContext.Contacts.Find(id);
            contact.Address = DataContext.Addresses.Find(contact.AddressId);
            return Ok(contact);
        }

        [HttpGet]
        [Route("getContacts/{search}")]
        public IHttpActionResult GetContacts(string search)
        {
            //split the search into individual terms
            var terms = search.ToLower().Split(' ');
            var list = DataContext.Contacts.Include("Address").ToList();
            var items = new List<Contact>();

            //return an item if every term appears in the contact somewhere
            foreach (var c in list)
            {
                bool valid = true;
                var searchable = c.Searchable();
                foreach (var t in terms)
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

        //As of now, fully functioning
        [HttpPost]
        [Route("updateContact")]
        public IHttpActionResult UpdateContact(Contact c)
        {
            //make sure that contact objects always keep their database key
            var oldContact = DataContext.Contacts.Find(c.ContactId);
            if (oldContact == null)
            {
                return Ok("contact missing");
            }
            {
                //change the contacts information besides the address (will remain same if there was no change)
                oldContact.FirstName = c.FirstName;
                oldContact.LastName = c.LastName;
                oldContact.PhoneNumber = c.PhoneNumber;
                oldContact.ServiceType = c.ServiceType;
                oldContact.Email = c.Email;
                DataContext.SaveChanges();
            }

            oldContact.Address = DataContext.Addresses.Find(oldContact.AddressId);
            //if addresses changed (or either object is missing an address) check if a new address needs to be made for the new values of changed address.
            if (AddressChanged(c.Address, oldContact.Address))
            {
                var a = c.Address;
                //see if we can reuse an address already in the system
                var _newAdd = DataContext.Addresses.Where(x => x.City == a.City && x.Zip == a.Zip && x.State == a.State && x.Street == a.Street).ToList();
                Address newAdd;

                if (_newAdd.Count != 0)
                    newAdd = _newAdd[0]; //use the address thats arleady made
                else
                {
                    //create a new address
                    newAdd = new Address();
                    newAdd.City = a.City;
                    newAdd.State = a.State;
                    newAdd.Street = a.Street;
                    newAdd.Zip = a.Zip;
                    newAdd.Latitude = a.Latitude;
                    newAdd.Longitude = a.Longitude;

                }
                oldContact.Address = newAdd;
            }

            DataContext.SaveChanges();

            var activity = new Activity(c, Module.Updated_Contact);
            DataContext.Activities.Add(activity);
            DataContext.SaveChanges();

            return Ok(oldContact);
        }
        [HttpPost]
        [Route("removeContact")]
        public IHttpActionResult RemoveContact(Contact c)
        {
            string message = "everything worked";
            var old = DataContext.Contacts.Find(c.ContactId);
            if(old == null)
            {
                return Ok();
            }
            var address = DataContext.Addresses.Find(old.AddressId);
            DataContext.Contacts.Remove(old);
            if (DataContext.Contacts.Count(x => x.AddressId == address.AddressId && x.ContactId != c.ContactId) == 0)
            {
                DataContext.Addresses.Remove(address);
                message += ": removed old address";
            }
            
            DataContext.SaveChanges();

            var activity = new Activity(c, Module.Deleted_Contact);
            DataContext.Activities.Add(activity);
            DataContext.SaveChanges();

            return Ok(message);
        }
        private bool AddressChanged(Address old, Address changed)
        {
            return old == null || changed == null || old.City != changed.City || old.Street != changed.Street || 
                old.State != changed.State || old.Zip != changed.Zip || old.AddressId != changed.AddressId;
        }
    }
}