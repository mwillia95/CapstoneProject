using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using Capstone_Project_v1.Models;
using System.Configuration;
using System.Net.Mail;
using System.Net;
using System.Net.Mime;
using TextmagicRest;
using TextmagicRest.Model;

namespace Capstone_Project_v1.Controllers.ApiControllers
{
    public class AppApiController : ApiController
    {
        protected const string AppName = "PublicEmergencyNotificationSystem";
        protected readonly DataContext DataContext;
        protected string AppEmail = ConfigurationManager.AppSettings["AppEmail"];

        public AppApiController()
        {
            DataContext = new DataContext();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="toEmail"> Contact Email Address</param>
        /// <param name="subj"> Subject of the Email</param>
        /// <param name="msg"> Body of the Email</param>
        /// <param name="fullName"> concat First and Last name to be something like "Adam Perry" </param>
        /// <param name="a"> the alert object that is being used...to update the status and get image name</param>
        /// <param name="statusType"> to know what to make the status....just past the string "UPDATE" if status needs to be update....etc</param>
        /// <returns></returns>

        public int SendNotifications(List<Capstone_Project_v1.Models.Contact> contacts, UpdateAlert a)
        {
            //contacts, list of contacts to notify
            //a, the original alert
            //type, the alertstatus to set when complete

            if(a.OriginAlert == null)
            {
                a.OriginAlert = DataContext.Alerts.Find(a.OriginAlertRefId);
            }

            int count = 0;
            foreach (var c in contacts)
            {
                string preference = c.ServiceType;
                string imageName = a.OriginAlert.ImageName;
                bool email = false;
                bool text = false;

                if (preference == "email" || preference == "both")
                    email = SendEmail(c.Email, a.Title, a.Description, c.FirstName + " " + c.LastName, imageName);


               // Uncomment the lines below to enable sending text messages if it was selected for the contact
                if (preference == "mobile" || preference == "both")   
                   text = SendText(c.PhoneNumber, a.Title + Environment.NewLine + a.Description);

                if (email || text)
                    count++;
            }

            return count;
        }
        
        public int SendNotifications(List<Capstone_Project_v1.Models.Contact> contacts, Alert a)
        {
            //contacts, list of contacts to notify
            //a, the original alert
            //type, the alertstatus to set when complete
            int count = 0;
            foreach(var c in contacts)
            {
                string preference = c.ServiceType;
                string imageName = a.ImageName;
                bool email = false;
                bool text = false;

                if(preference == "email" || preference == "both")
                    email = SendEmail(c.Email, a.Title, a.Description, c.FirstName + " " + c.LastName, imageName);

                //Uncomment the lines below to enable text messaging
                if(preference == "mobile" || preference == "both")
                    text = SendText(c.PhoneNumber, a.Title + Environment.NewLine + a.Description);

                if(email || text)
                    count++;
            }

            return count;
        }
        public bool SendEmail(string toEmail, string subj, string msg, string fullName, string imageName)
        {
            var fromAddress = new MailAddress("publicemergencysystem@gmail.com", "ENS");
            var toAddress = new MailAddress($"{toEmail}", $"{fullName}");
            const string fromPassword = "shrekemergency";
            string subject = subj;
            string body = msg;

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            var message = new MailMessage(fromAddress, toAddress);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;
            message.AlternateViews.Add(getEmbeddedImage(HttpContext.Current.Server.MapPath("~//StaticMaps//" + imageName), body));

            try
            {
                smtp.Send(message);
            }
            catch
            {
                return false;
            }

            return true;
        }

        private AlternateView getEmbeddedImage(string filePath, string body)
        {
            LinkedResource res = new LinkedResource(filePath);
            res.ContentId = Guid.NewGuid().ToString();
            string htmlBody = @"<img src='cid:" + res.ContentId + @"'/><br/><p>" + body + "</p>";
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);
            alternateView.LinkedResources.Add(res);
            return alternateView;
        }

        public bool SendText(string phone, string content)
        {
            var client = new Client("adamperry1", "2RT8BaXnn2RU1zRimtUxe9gTndZuJn"); //this is the username of the account and the api key....dont mess with this
            var link = client.SendMessage(content, "1" + phone); //message, then phonenumber with Country Code and area code.....1 is the US country code

            return link.Success;

        }
    }
}