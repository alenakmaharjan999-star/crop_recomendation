// Services/PasswordService.cs
// Wraps BCrypt for hashing and verifying passwords
// BCrypt automatically adds salt — no need to manage it manually
// Package: BCrypt.Net-Next

namespace crop.Services;

public interface IPasswordService
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public class PasswordService : IPasswordService
{
    // Called during Register — turns "abc123" into "$2a$11$..."
    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    // Called during Login — compares plain + hash safely
    // Returns true if password matches, false otherwise
    public bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}