//namespace crop.Models
//{
//    public class PredictionHistory
//    {
//    }
//}


// Models/PredictionHistory.cs
// Maps 1:1 to PredictionHistory table in SQL Server
// One row saved every time a user gets a crop prediction

using crop.Models;

namespace crop.Models;

public class PredictionHistory
{
    // → PredictionId INT IDENTITY PRIMARY KEY
    public int PredictionId { get; set; }

    // → UserId INT FOREIGN KEY → Users(UserId)
    public int UserId { get; set; }

    // Soil inputs — sent by React form
    public float Nitrogen { get; set; }
    public float Phosphorus { get; set; }
    public float Potassium { get; set; }
    public float Ph { get; set; }

    // User types this in React — used to fetch weather
    public string Location { get; set; } = string.Empty;

    // Weather values — fetched by WeatherService, NOT from React
    public float Temperature { get; set; }
    public float Humidity { get; set; }
    public float Rainfall { get; set; }

    // Result from Python ML model
    public string PredictedCrop { get; set; } = string.Empty;

    // → CreatedAt DATETIME DEFAULT GETDATE()
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property — links back to the User
    public User? User { get; set; }
}
