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
        public Alert SendNotification(string toEmail, string subj, string msg, string fullName, Alert a, string statusType)
        {
            var fromAddress = new MailAddress("publicemergencysystem@gmail.com", "From ENS");
            var toAddress = new MailAddress($"{toEmail}", $"To {fullName}");
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
            message.AlternateViews.Add(getEmbeddedImage(HttpContext.Current.Server.MapPath("~//StaticMaps//" + a.ImageName)));

            try
            {
                smtp.Send(message);
            }
            catch
            {
                a.Status = AlertStatus.Pending;
                return a;
            }

            if (statusType == "UPDATE")
            {
                a.Status = AlertStatus.Updated;
            }
            else if (statusType == "COMPLETE")
            {
                a.Status = AlertStatus.Complete;
            }
            else if (statusType == "ONGOING")
            {
                a.Status = AlertStatus.Ongoing;
            }

            return a;
        }

        //public void SendEmailTest()
        //{
        //    var fromAddress = new MailAddress("publicemergencysystem@gmail.com", "From ENS");
        //    var toAddress = new MailAddress($"abomb1210@gmail.com", $"To Adam Perry");
        //    const string fromPassword = "shrekemergency";
        //    string subject = "This is a test subject.";
        //    string body = "This is the test body.";

        //    var smtp = new SmtpClient
        //    {
        //        Host = "smtp.gmail.com",
        //        Port = 587,
        //        EnableSsl = true,
        //        DeliveryMethod = SmtpDeliveryMethod.Network,
        //        UseDefaultCredentials = false,
        //        Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        //    };

        //    var message = new MailMessage(fromAddress, toAddress);
        //    message.Subject = subject;
        //    message.Body = body;
        //    message.IsBodyHtml = true;
        //    message.AlternateViews.Add(getEmbeddedImage(HttpContext.Current.Server.MapPath("~//StaticMaps//40_map.png")));

        //    try
        //    {
        //            smtp.Send(message);
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //}

        private AlternateView getEmbeddedImage(string filePath)
        {
            LinkedResource res = new LinkedResource(filePath);
            res.ContentId = Guid.NewGuid().ToString();
            string htmlBody = @"<img src='cid:" + res.ContentId + @"'/>";
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);
            alternateView.LinkedResources.Add(res);
            return alternateView;
        }
    }
}