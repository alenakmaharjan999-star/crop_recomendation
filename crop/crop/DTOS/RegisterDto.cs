//namespace crop.DTOS
//{
//    public class RegisterDto
//    {
//    }
//}

// DTOs/RegisterDto.cs
// DTO = Data Transfer Object
// This is the shape of JSON React sends to /api/auth/register
// We NEVER expose the User model directly to React

namespace crop.DTOs;

public class RegisterDto
{
    // React sends: { "email": "me@example.com", "password": "abc123" }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}