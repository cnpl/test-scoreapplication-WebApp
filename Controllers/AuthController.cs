using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace ScoreTracker.WebApp.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("microsoft-login")]
    public IActionResult MicrosoftLogin()
    {
        var properties = new AuthenticationProperties { RedirectUri = "/" };
        return Challenge(properties, "Saml2");
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties { RedirectUri = "/" };
        return Challenge(properties, "Google");
    }
}
