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

public record AuthResult(string Token, User User);

    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterDto dto);
        Task<AuthResult> LoginAsync(LoginDto dto);
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
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new Exception("Username is required");

        if (dto.Username.Trim().Length > 50)
            throw new Exception("Username must be 50 characters or fewer");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

        if (dto.Password != dto.ConfirmPassword)
            throw new Exception("Passwords do not match");

        if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Username, @"^[a-zA-Z0-9_]+$"))
            throw new Exception("Username can only contain letters, numbers, and underscores");

        if (System.Text.RegularExpressions.Regex.IsMatch(dto.Username, @"^[0-9]+$"))
            throw new Exception("Username cannot be only numbers");

        var normalizedUsername = dto.Username.Trim();

        var existingUsername = await _users.GetByUsernameAsync(normalizedUsername);
        if (existingUsername != null) throw new Exception("Username already taken");

        // Hash password with BCrypt, save to DB
        var user = new User
        {
            Username = normalizedUsername,
            PasswordHash = _password.Hash(dto.Password)
        };
        await _users.AddAsync(user);
        return user;
    }

    public async Task<AuthResult> LoginAsync(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new Exception("Username is required");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

        if (dto.Password.Length < 6)
            throw new Exception("Password must be at least 6 characters long");

        if (!dto.Password.Any(char.IsDigit))
            throw new Exception("Password must contain at least one number");

        var user = await _users.GetByUsernameAsync(dto.Username.Trim());
        if (user == null)
            throw new Exception("User not found");

        if (!_password.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        // Build JWT token with UserId and Username
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

        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
        return new AuthResult(tokenValue, user);
    }
}
