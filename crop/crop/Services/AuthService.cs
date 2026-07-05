// Services/AuthService.cs
// Business logic for register and login
// Uses: IUserRepository (DB), IPasswordService (BCrypt), IConfiguration (JWT key)

using crop.DTOs;
using crop.Models;
using crop.Repositories;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace crop.Services;

public interface IAuthService
{
    Task<User> RegisterAsync(RegisterDto dto);
    Task<string> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordService _password;
    private readonly IConfiguration _config;

    public AuthService(IUserRepository users, IPasswordService password, IConfiguration config)
    { _users = users; _password = password; _config = config; }

    public async Task<User> RegisterAsync(RegisterDto dto)
    {
        // Check if username already exists
        var existing = await _users.GetByUsernameAsync(dto.Username);
        if (existing != null) throw new Exception("Username already taken");

        // Hash password with BCrypt, save to DB
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = _password.Hash(dto.Password)
        };
        await _users.AddAsync(user);
        return user;
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        // Find user in DB, verify password
        var user = await _users.GetByUsernameAsync(dto.Username);
        if (user == null || !_password.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        // Build JWT token with UserId inside (used by controllers)
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}