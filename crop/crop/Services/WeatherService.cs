// Services/WeatherService.cs
// Calls OpenWeather API using Location string from React
// Returns temperature, humidity, rainfall — fed into ML model
// API key stored in appsettings.json, never hardcoded

using System.Text.Json;

namespace crop.Services;

public interface IWeatherService
{
    Task<(float temperature, float humidity, float rainfall)> GetWeatherAsync(string location);
}

public class WeatherService : IWeatherService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public WeatherService(HttpClient http, IConfiguration config)
    { _http = http; _config = config; }

    public async Task<(float, float, float)> GetWeatherAsync(string location)
    {
        var apiKey = _config["OpenWeather:ApiKey"];
        var url = $"https://api.openweathermap.org/data/2.5/weather"
                + $"?q={Uri.EscapeDataString(location)}&appid={apiKey}&units=metric";

        var response = await _http.GetAsync(url);
        if (!response.IsSuccessStatusCode)
            throw new Exception($"Weather lookup failed for '{location}'");

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        // Parse temperature and humidity from "main" object
        float temperature = json.GetProperty("main").GetProperty("temp").GetSingle();
        float humidity = json.GetProperty("main").GetProperty("humidity").GetSingle();

        // Rainfall is optional — not all locations have rain data
        float rainfall = 0f;
        if (json.TryGetProperty("rain", out var rain) &&
            rain.TryGetProperty("1h", out var oneHour))
            rainfall = oneHour.GetSingle();

        return (temperature, humidity, rainfall);
    }
}