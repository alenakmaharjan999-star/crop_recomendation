

// DTOs/LoginDto.cs
// Shape of JSON React sends to /api/auth/login

namespace crop.DTOs;

public class LoginDto
{
    // React sends: { "email": "me@example.com", "password": "abc123" }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
