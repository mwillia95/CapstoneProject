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
        public Alert SendNotification(string toEmail, string subj, string msg, string fullName, Alert a, AlertStatus statusType)
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
            message.AlternateViews.Add(getEmbeddedImage(HttpContext.Current.Server.MapPath("~//StaticMaps//" + a.ImageName), body));

            try
            {
                smtp.Send(message);
            }
            catch
            {
                a.Status = AlertStatus.Pending;
                return a;
            }

            a.Status = statusType;
            return a;
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

        public Alert SendText(Alert a, string phone, AlertStatus statusType)
        {
            var client = new Client("adamperry1", "2RT8BaXnn2RU1zRimtUxe9gTndZuJn"); //this is the username of the account and the api key....dont mess with this
            var link = client.SendMessage(a.Title + Environment.NewLine + a.Description, "1" + phone); //message, then phonenumber with Country Code and area code.....1 is the US country code

            //somewhere in here is where we adjust the AlertStatus
            if(link.Success)
            {
                if(statusType == AlertStatus.Updated)
                {
                    a.Status = AlertStatus.Updated;
                }
                else if(statusType == AlertStatus.Complete)
                {
                    a.Status = AlertStatus.Complete;
                }
                else if(statusType == AlertStatus.Ongoing)
                {
                    a.Status = AlertStatus.Ongoing;
                }
                //Message successfully sent
            }
            else
            {
                a.Status = AlertStatus.Pending;
                //message not sent due to following exception......can access with      link.ClientException.Message
            }

            return a; 
        }
    }
}