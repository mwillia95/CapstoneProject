using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Capstone_Project_v1.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Net.Http;

//DEFAULT LOGIN CREDENTIALS:
//Email: director@company.com
//Password: Password1!

//To remove login requirement, edit the overrideLogin variable below to true
namespace Capstone_Project_v1.Controllers.ApiControllers
{
    [RoutePrefix("api/" + AppName + "/accounts")]

    public class AccountController : AppApiController
    {
        static readonly bool overrideLogin = true;
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private IAuthenticationManager _authenticationManager;
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public IAuthenticationManager AuthenticationManager
        {
            get
            {
                return _authenticationManager ?? HttpContext.Current.GetOwinContext().Authentication;
            }
            private set
            {
                _authenticationManager = value;
            }
        }

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login(Account a)
        {
            if(a.Email == null || a.Password == null)
            {
                return Ok("Error");
            }
            try
            {
                var result = SignInManager.PasswordSignIn(a.Email, a.Password, true, shouldLockout: false);
                if (result == SignInStatus.Success)
                {
                    return Ok("Success");
                }
                else
                {
                    return Ok("Error");
                }
            }
            catch(Exception)
            {
                return Ok("Error");
            }
        }

        [HttpPost]
        [Route("logout")]
        public IHttpActionResult Logoff(Account a)
        {
            try
            {
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                return Ok();
            }
            catch (Exception e)
            {
                return Ok(e.Message);
            }
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register(RegisterModel model)
        {
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            
            var result = UserManager.Create(user, model.Password);
            if (result.Succeeded)
            {
                SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                return Ok("Success");
            }
            return Ok(UserManager);
            //AddErrors(result);
        }

        [HttpGet]
        [Route("isAuthorized")]
        public bool isAuthorized()
        {
            //If you want to override authentication, change overrideLogin variable to true (top of class)

            return AuthenticationManager.User.Identity.IsAuthenticated || overrideLogin;
        }

        [HttpGet]
        [Route("getName")]
        public string getFullName()
        {
            var userClaim = AuthenticationManager.User.Identity;
            var user = UserManager.FindById(userClaim.GetUserId());
            if(user.FullName == "" || user.FullName == null)
            {
                user.FullName = "Mitchell Williams";
            }
            return user.FullName;
        }
    }
}