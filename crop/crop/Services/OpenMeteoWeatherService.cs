using System.Text.Json;
using System.Text.Json.Serialization;

namespace crop.Services;

public interface IWeatherService
{
    Task<(float temperature, float humidity, float rainfall)> GetWeatherAsync(string location);
    Task<(float temperature, float humidity, float rainfall)> GetSeasonalWeatherAsync(
        string location, string season, int yearsBack = 5);
}

public class OpenMeteoWeatherService : IWeatherService
{
    private readonly HttpClient _http;
    private readonly ILogger<OpenMeteoWeatherService> _logger;

    public OpenMeteoWeatherService(HttpClient http, ILogger<OpenMeteoWeatherService> logger)
    {
        _http = http;
        _logger = logger;
    }

    // ============================================================
    // 1. GEOCODE: Location → Coordinates
    // ============================================================
    private async Task<(float lat, float lon, string name)?> GeocodeLocationAsync(string location)
    {
        try
        {
            var url = $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(location)}&count=1&language=en&format=json";

            var response = await _http.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadFromJsonAsync<GeocodingResponse>();
            if (json?.Results == null || json.Results.Length == 0)
            {
                _logger.LogWarning($"⚠️ Location '{location}' not found in Open-Meteo");
                return null;
            }

            var result = json.Results[0];
            return (result.Latitude, result.Longitude, result.Name);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Geocoding failed for location: {Location}", location);
            return null;
        }
    }

    // ============================================================
    // 2. FETCH HISTORICAL WEATHER
    // ============================================================
    private async Task<(float temp, float humidity, float rainfall)?> FetchHistoricalWeatherAsync(
        float lat, float lon, string startDate, string endDate)
    {
        try
        {
            var url = $"https://archive-api.open-meteo.com/v1/archive?" +
                      $"latitude={lat}&longitude={lon}" +
                      $"&start_date={startDate}&end_date={endDate}" +
                      $"&daily=temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum" +
                      $"&timezone=auto&format=json";

            var response = await _http.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadFromJsonAsync<HistoricalWeatherResponse>();
            if (json?.Daily == null)
                return null;

            var temps = json.Daily.Temperature2mMean?.Where(t => t.HasValue).Select(t => t.Value).ToList();
            var humidities = json.Daily.RelativeHumidity2mMean?.Where(h => h.HasValue).Select(h => h.Value).ToList();
            var rainfalls = json.Daily.PrecipitationSum?.Where(r => r.HasValue).Select(r => r.Value).ToList();

            if (temps == null || temps.Count == 0 || humidities == null || humidities.Count == 0)
                return null;

            float avgTemp = temps.Average();
            float avgHumidity = humidities.Average();
            float totalRainfall = rainfalls?.Sum() ?? 0;

            return (avgTemp, avgHumidity, totalRainfall);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Historical weather fetch failed");
            return null;
        }
    }

    // ============================================================
    // 3. GET SEASONAL WEATHER (MAIN METHOD)
    // ============================================================
    public async Task<(float temperature, float humidity, float rainfall)> GetSeasonalWeatherAsync(
        string location, string season, int yearsBack = 5)
    {
        // 3a: Geocode
        var geoResult = await GeocodeLocationAsync(location);
        if (geoResult == null)
        {
            string errorMessage = $"Sorry, couldn't find weather data for '{location}'. " +
                                  $"Please check the spelling or try a nearby city or district name.";
            _logger.LogError(errorMessage);
            throw new Exception(errorMessage);
        }

        var (lat, lon, name) = geoResult.Value;
        _logger.LogInformation($"📍 Found location: {name} ({lat}, {lon})");

        // 3b: Define season months
        var (startMonth, endMonth, label) = season.ToLower() switch
        {
            "monsoon" => (6, 10, "June-October"),
            "winter" => (11, 4, "November-April"),
            "summer" => (3, 6, "March-June"),
            _ => throw new Exception($"Unknown season: {season}")
        };

        _logger.LogInformation($"🌱 Season: {season} ({label})");

        var allTemps = new List<float>();
        var allHumidities = new List<float>();
        var allRainfalls = new List<float>();

        var currentYear = DateTime.Now.Year;

        // 3c: Fetch each year
        for (int year = currentYear - yearsBack; year < currentYear; year++)
        {
            string startDate, endDate;

            if (season.ToLower() == "winter")
            {
                // Rabi crosses year boundary (Nov 2023 to Apr 2024)
                startDate = $"{year - 1}-{startMonth:D2}-01";
                endDate = $"{year}-{endMonth:D2}-30";
            }
            else
            {
                startDate = $"{year}-{startMonth:D2}-01";
                int lastDay = endMonth switch
                {
                    3 or 5 or 7 or 8 or 10 or 12 => 31,
                    4 or 6 or 9 or 11 => 30,
                    _ => 28
                };
                endDate = $"{year}-{endMonth:D2}-{lastDay:D2}";
            }

            var weather = await FetchHistoricalWeatherAsync(lat, lon, startDate, endDate);
            if (weather.HasValue)
            {
                allTemps.Add(weather.Value.temp);
                allHumidities.Add(weather.Value.humidity);
                allRainfalls.Add(weather.Value.rainfall);
                _logger.LogInformation($"   {year}: {weather.Value.temp:F1}°C, {weather.Value.humidity:F0}%, {weather.Value.rainfall:F0}mm");
            }
        }

        if (allTemps.Count == 0)
            throw new Exception($"No weather data available for {location} in {season} season");

        // 3d: Calculate averages
        var avgTemp = allTemps.Average();
        var avgHumidity = allHumidities.Average();
        var avgRainfall = allRainfalls.Average();

        _logger.LogInformation($"📊 Seasonal Averages: {avgTemp:F1}°C, {avgHumidity:F0}%, {avgRainfall:F0}mm");

        return (avgTemp, avgHumidity, avgRainfall);
    }

    // ============================================================
    // 4. CURRENT WEATHER (Fallback)
    // ============================================================
    public async Task<(float temperature, float humidity, float rainfall)> GetWeatherAsync(string location)
    {
        try
        {
            var geoResult = await GeocodeLocationAsync(location);
            if (geoResult == null)
                throw new Exception($"Location '{location}' not found");

            var (lat, lon, _) = geoResult.Value;

            var url = $"https://api.open-meteo.com/v1/forecast?" +
                      $"latitude={lat}&longitude={lon}" +
                      $"&current=temperature_2m,relative_humidity_2m,precipitation" +
                      $"&timezone=auto&format=json";

            var response = await _http.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to fetch current weather");

            var json = await response.Content.ReadFromJsonAsync<CurrentWeatherResponse>();
            if (json?.Current == null)
                throw new Exception("No current weather data");

            return (
                temperature: json.Current.Temperature2m,
                humidity: json.Current.RelativeHumidity2m,
                rainfall: json.Current.Precipitation ?? 0
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Current weather fetch failed");
            throw;
        }
    }
}

// ============================================================
// RESPONSE CLASSES
// ============================================================

public class GeocodingResponse
{
    [JsonPropertyName("results")]
    public GeocodingResult[]? Results { get; set; }
}

public class GeocodingResult
{
    [JsonPropertyName("latitude")]
    public float Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public float Longitude { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;

    [JsonPropertyName("admin1")]
    public string Admin1 { get; set; } = string.Empty;
}

public class HistoricalWeatherResponse
{
    [JsonPropertyName("daily")]
    public DailyWeather? Daily { get; set; }
}

public class DailyWeather
{
    [JsonPropertyName("temperature_2m_mean")]
    public float?[]? Temperature2mMean { get; set; }

    [JsonPropertyName("relative_humidity_2m_mean")]
    public float?[]? RelativeHumidity2mMean { get; set; }

    [JsonPropertyName("precipitation_sum")]
    public float?[]? PrecipitationSum { get; set; }
}

public class CurrentWeatherResponse
{
    [JsonPropertyName("current")]
    public CurrentWeather? Current { get; set; }
}

public class CurrentWeather
{
    [JsonPropertyName("temperature_2m")]
    public float Temperature2m { get; set; }

    [JsonPropertyName("relative_humidity_2m")]
    public float RelativeHumidity2m { get; set; }

    [JsonPropertyName("precipitation")]
    public float? Precipitation { get; set; }
}