using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TwoType.Startup))]
namespace TwoType
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
