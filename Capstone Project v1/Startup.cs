using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Capstone_Project_v1.Startup))]
namespace Capstone_Project_v1
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
