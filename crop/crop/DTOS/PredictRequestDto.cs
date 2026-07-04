// DTOs/PredictRequestDto.cs
// What React sends to /api/prediction/predict
// NOTE: No Temperature/Humidity/Rainfall here
//       WeatherService fetches those from Location automatically

namespace crop.DTOs;

public class PredictRequestDto
{
    // Soil values — user fills in the React form
    public float Nitrogen { get; set; }
    public float Phosphorus { get; set; }
    public float Potassium { get; set; }
    public float Ph { get; set; }

    // User types their city/location
    // WeatherService uses this to call OpenWeather API
    public string Location { get; set; } = string.Empty;
}