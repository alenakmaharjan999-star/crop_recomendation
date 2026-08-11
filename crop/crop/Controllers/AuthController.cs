//using Microsoft.AspNetCore.Mvc;

//namespace crop.Controllers
//{
//    public class AuthController : Controller
//    {
//        public IActionResult Index()
//        {
//            return View();
//        }
//    }
//}

// Controllers/AuthController.cs
// Handles: POST /api/auth/register
//          POST /api/auth/login
// No [Authorize] here — public endpoints

using Microsoft.AspNetCore.Mvc;
using crop.DTOs;
using crop.Services;

namespace crop.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    // React calls: POST /api/auth/register
    // Body: { "email": "me@example.com", "password": "abc123" }
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            var user = await _auth.RegisterAsync(dto);
            var token = await _auth.LoginAsync(new LoginDto
            {
                Email = dto.Email,
                Password = dto.Password
            });

            return Ok(new
            {
                token,
                user = new { user.UserId, user.Email }
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // React calls: POST /api/auth/login
    // Returns: { "token": "eyJhbGci..." }
    // React stores this token in localStorage
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var token = await _auth.LoginAsync(dto);
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }
}
