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
using crop.Services;

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
        // Step 1: get weather from OpenWeather using Location
        var (temperature, humidity, rainfall) = await _weather.GetWeatherAsync(dto.Location);

        // Step 2: call Python Flask /predict with all 7 ML features
        var client = _httpFactory.CreateClient("PythonML");
        var payload = new
        {
            N = dto.Nitrogen,
            P = dto.Phosphorus,
            K = dto.Potassium,
            pH = dto.Ph,
            temperature,
            humidity,
            rainfall
        };
        var response = await client.PostAsJsonAsync("/predict", payload);
        if (!response.IsSuccessStatusCode)
            throw new Exception("ML service call failed");

        var result = await response.Content.ReadFromJsonAsync<PredictResponseDto>()
                     ?? throw new Exception("Empty prediction response");

        // Step 3: save everything to PredictionHistory table
        await _predictions.AddAsync(new PredictionHistory
        {
            UserId = userId,
            Nitrogen = dto.Nitrogen,
            Phosphorus = dto.Phosphorus,
            Potassium = dto.Potassium,
            Ph = dto.Ph,
            Location = dto.Location,
            Temperature = temperature,
            Humidity = humidity,
            Rainfall = rainfall,
            PredictedCrop = result.PredictedCrop
        });

        // Step 4: return to controller → React
        return result;
    }

    public Task<List<PredictionHistory>> GetHistoryAsync(int userId)
        => _predictions.GetByUserIdAsync(userId);
}
