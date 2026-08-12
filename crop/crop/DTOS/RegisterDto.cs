//namespace crop.DTOS
//{
//    public class RegisterDto
//    {
//    }
//}

// DTOs/RegisterDto.cs
// DTO = Data Transfer Object
// Shape of JSON React sends to /api/auth/register
// We NEVER expose the User model directly to React

namespace crop.DTOs;

public class RegisterDto
{
    // React sends: { "username": "alena", "password": "abc123", "confirmPassword": "abc123" }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
