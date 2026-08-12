//namespace crop.Models
//{
//    public class User
//    {
//    }
//}


// Models/User.cs
// Maps 1:1 to the Users table in SQL Server
// EF Core uses this class to read/write rows

namespace crop.Models;

public class User
{
    // → UserId INT IDENTITY PRIMARY KEY
    public int UserId { get; set; }

    // → Username NVARCHAR(100) UNIQUE NOT NULL
    public string Username { get; set; } = string.Empty;

    // → PasswordHash NVARCHAR(255) NOT NULL
    // Never store plain password — always BCrypt hashed
    public string PasswordHash { get; set; } = string.Empty;

    // → CreatedAt DATETIME DEFAULT GETDATE()
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property — not a DB column
    // Lets you do: user.Predictions to get all their history
    public ICollection<PredictionHistory> Predictions { get; set; }
        = new List<PredictionHistory>();
}
