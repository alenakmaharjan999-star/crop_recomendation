// Services/PredictionService.cs
// The core business logic of E-Krishi
// Steps:
//   1. Fetch weather for Location (WeatherService)
//   2. Call Python Flask ML API with all 7 features
//   3. Save result to SQL Server (PredictionRepository)
//   4. Return prediction to Controller → React

using crop.DTOs;
using crop.Models;
using crop.Repositories;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace crop.Services;

public interface IPredictionService
{
    Task<PredictResponseDto> PredictAsync(PredictRequestDto dto, int userId);
    Task<List<PredictionHistory>> GetHistoryAsync(int userId);
}

public class PredictionService : IPredictionService
{
    private readonly IHttpClientFactory _httpFactory;
    private readonly IWeatherService _weather;
    private readonly IPredictionRepository _predictions;

    public PredictionService(
        IHttpClientFactory httpFactory,
        IWeatherService weather,
        IPredictionRepository predictions)
    { _httpFactory = httpFactory; _weather = weather; _predictions = predictions; }

    public async Task<PredictResponseDto> PredictAsync(PredictRequestDto dto, int userId)
    {
        var location = string.IsNullOrWhiteSpace(dto.Location) ? "Kathmandu" : dto.Location;
        var temperature = dto.Temperature;
        var humidity = dto.Humidity;
        var rainfall = dto.Rainfall;

        if (temperature == 0 && humidity == 0 && rainfall == 0)
        {
            (temperature, humidity, rainfall) = await _weather.GetWeatherAsync(location);
        }

        // Step 2: call Python Flask /predict with all 7 ML features
        var client = _httpFactory.CreateClient("PythonML");
        var payload = new
        {
            N = dto.Nitrogen,
            P = dto.Phosphorus,
            K = dto.Potassium,
            ph = dto.Ph,
            temperature,
            humidity,
            rainfall
        };
        //var response = await client.PostAsJsonAsync("/predict", payload);
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = null };
        var response = await client.PostAsJsonAsync("/predict", payload, jsonOptions);
        if (!response.IsSuccessStatusCode)
            throw new Exception("ML service call failed");

        var mlResult = await response.Content.ReadFromJsonAsync<FlaskPredictionResponse>()
                     ?? throw new Exception("Empty prediction response");
        var result = new PredictResponseDto
        {
            PredictedCrop = mlResult.RecommendedCrop,
            Confidence = 0
        };

        // Step 3: save everything to PredictionHistory table
        var historyRecord = new PredictionHistory
        {
            UserId = userId,
            Nitrogen = dto.Nitrogen,
            Phosphorus = dto.Phosphorus,
            Potassium = dto.Potassium,
            Ph = dto.Ph,
            Location = location,
            Temperature = temperature,
            Humidity = humidity,
            Rainfall = rainfall,
            PredictedCrop = result.PredictedCrop
        };

        await _predictions.AddAsync(historyRecord);

        // Step 4: return to controller → React
        return result;
    }

    public Task<List<PredictionHistory>> GetHistoryAsync(int userId)
        => _predictions.GetByUserIdAsync(userId);

    private sealed class FlaskPredictionResponse
    {
        [JsonPropertyName("recommended_crop")]
        public string RecommendedCrop { get; set; } = string.Empty;
    }
}

