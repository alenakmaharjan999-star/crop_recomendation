using crop.DTOs;
using crop.Models;
using crop.Repositories;
using crop.Validation;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace crop.Services;

public interface IPredictionService
{
    Task<PredictResponseDto> PredictAsync(PredictRequestDto dto, int userId);
    Task<PredictionWithMetricsResponseDto> PredictWithMetricsAsync(PredictRequestDto dto, int userId);
    Task<List<PredictionHistory>> GetHistoryAsync(int userId);
}

public class PredictionService : IPredictionService
{
    private readonly IHttpClientFactory _httpFactory;
    private readonly IWeatherService _weather;
    private readonly IPredictionRepository _predictions;
    private readonly ILogger<PredictionService> _logger;

    public PredictionService(
        IHttpClientFactory httpFactory,
        IWeatherService weather,
        IPredictionRepository predictions,
        ILogger<PredictionService> logger)
    {
        _httpFactory = httpFactory;
        _weather = weather;
        _predictions = predictions;
        _logger = logger;
    }

    public async Task<PredictResponseDto> PredictAsync(PredictRequestDto dto, int userId)
    {
        // 1. Validate location
        if (!LocationCatalog.TryNormalize(dto.Location, out var location))
            throw new ArgumentException($"'{dto.Location}' is not a recognised district or city.", nameof(dto));

        // 2. ALWAYS fetch weather
        float temperature, humidity, rainfall;

        try
        {
            string season = GetCurrentSeason();
            _logger.LogInformation($"🌱 Fetching {season} season weather for {location}");

            (temperature, humidity, rainfall) = await _weather.GetSeasonalWeatherAsync(
                location, season, 5);

            // ============================================================
            // ✅ FIX: Convert total rainfall to monthly average
            // ============================================================

            // Get number of months in the season
            int monthsInSeason = season.ToLower() switch
            {
                "monsoon" => 5,   // June-October (5 months)
                "winter" => 6,     // November-April (6 months)
                "summer" => 4,     // March-June (4 months)
                _ => 5
            };

            // Convert total rainfall to monthly average
            float monthlyRainfall = rainfall / monthsInSeason;

            _logger.LogInformation($"🌧️ Rainfall: {rainfall}mm total → {monthlyRainfall}mm monthly average ({monthsInSeason} months)");

            // Cap at dataset max (300mm)
            if (monthlyRainfall > 300)
            {
                _logger.LogWarning($"⚠️ Monthly rainfall {monthlyRainfall}mm exceeds max (300mm). Capping.");
                monthlyRainfall = 300;
            }

            rainfall = monthlyRainfall;

            _logger.LogInformation($"✅ Final weather: {temperature}°C, {humidity}%, {rainfall}mm");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Seasonal weather failed, falling back to current weather");
            (temperature, humidity, rainfall) = await _weather.GetWeatherAsync(location);
            _logger.LogInformation($"⚠️ Using current weather: {temperature}°C, {humidity}%, {rainfall}mm");
        }

        // 3. Send to Python with ALL 7 fields
        var payload = new
        {
            nitrogen = dto.Nitrogen,
            phosphorus = dto.Phosphorus,
            potassium = dto.Potassium,
            ph = dto.Ph,
            temperature = temperature,
            humidity = humidity,
            rainfall = rainfall
        };

        var client = _httpFactory.CreateClient("PythonML");
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = null };
        var response = await client.PostAsJsonAsync("/predict", payload, jsonOptions);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError($"ML service error: {errorContent}");
            throw new Exception($"ML service call failed: {errorContent}");
        }

        var mlResult = await response.Content.ReadFromJsonAsync<FlaskPredictionResponse>()
            ?? throw new Exception("Empty prediction response");

        if (string.IsNullOrWhiteSpace(mlResult.RecommendedCrop))
            throw new Exception("ML service returned no crop");

        var result = new PredictResponseDto
        {
            PredictedCrop = mlResult.RecommendedCrop,
            Confidence = mlResult.Confidence ?? 0
        };

        // 4. Save to database
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
            PredictedCrop = result.PredictedCrop,
            Confidence = result.Confidence
        };

        await _predictions.AddAsync(historyRecord);

        return result;
    }
    public async Task<PredictionWithMetricsResponseDto> PredictWithMetricsAsync(PredictRequestDto dto, int userId)
    {
        // 1. Reuse existing prediction logic
        var predictionResult = await PredictAsync(dto, userId);

        // 2. Get metrics from Python API
        var client = _httpFactory.CreateClient("PythonML");
        var metricsResponse = await client.GetAsync("/metrics");

        if (!metricsResponse.IsSuccessStatusCode)
        {
            // If metrics fail, return prediction without metrics
            _logger.LogWarning("Could not fetch metrics from Python API");
            return new PredictionWithMetricsResponseDto
            {
                PredictedCrop = predictionResult.PredictedCrop,
                Confidence = predictionResult.Confidence,
                Accuracy = 0,
                Precision = 0,
                Recall = 0,
                F1Score = 0,
                ConfusionMatrix = null,
                FertilizerRecommendation = null
            };
        }

        var metricsResult = await metricsResponse.Content.ReadFromJsonAsync<FlaskMetricsResponse>()
            ?? throw new Exception("Empty metrics response");
        //get prediciton with fertilizer
        var predictionWithFertilizer = await GetPredictionWithFertilizerAsync(dto);
        // 3. Return combined result
        return new PredictionWithMetricsResponseDto
        {
            PredictedCrop = predictionResult.PredictedCrop,
            Confidence = predictionResult.Confidence,
            Accuracy = metricsResult.Metrics.Accuracy,
            Precision = metricsResult.Metrics.Precision,
            Recall = metricsResult.Metrics.Recall,
            F1Score = metricsResult.Metrics.F1Score,
            // ✅ USE FULL NAMESPACE
            ConfusionMatrix = new crop.DTOs.ConfusionMatrixData
            {
                Labels = metricsResult.Metrics.ConfusionMatrix.Labels,
                Matrix = metricsResult.Metrics.ConfusionMatrix.Matrix
            },
            FertilizerRecommendation = new crop.DTOs.FertilizerRecommendation
            {
                Crop = predictionWithFertilizer.FertilizerRecommendation?.Crop ?? "",
                SoilNpk = new crop.DTOs.SoilNpk
                {
                    N = predictionWithFertilizer.FertilizerRecommendation?.SoilNpk?.N ?? 0,
                    P = predictionWithFertilizer.FertilizerRecommendation?.SoilNpk?.P ?? 0,
                    K = predictionWithFertilizer.FertilizerRecommendation?.SoilNpk?.K ?? 0
                },
                Deficit = new crop.DTOs.Deficit
                {
                    N = predictionWithFertilizer.FertilizerRecommendation?.Deficit?.N ?? 0,
                    P = predictionWithFertilizer.FertilizerRecommendation?.Deficit?.P ?? 0,
                    K = predictionWithFertilizer.FertilizerRecommendation?.Deficit?.K ?? 0
                },
                Recommendation = new crop.DTOs.FertilizerRecommendationDetail
                {
                    Name = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.Name ?? "",
                    Npk = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.Npk ?? "",
                    ApplicationRateKgPerHa = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.ApplicationRateKgPerHa ?? 0,
                    DeficientNutrients = new crop.DTOs.Deficit
                    {
                        N = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.DeficientNutrients?.N ?? 0,
                        P = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.DeficientNutrients?.P ?? 0,
                        K = predictionWithFertilizer.FertilizerRecommendation?.Recommendation?.DeficientNutrients?.K ?? 0
                    }
                }
            }
        };
    }

    // Helper: Detect current season
    private string GetCurrentSeason()
    {
        var month = DateTime.Now.Month;

        if (month >= 6 && month <= 10)
            return "monsoon";
        else if (month >= 11 || month <= 4)
            return "winter";
        else // March, April, May
            return "summer";
    }
    // ============================================================
    // ✅ ADD THIS HELPER METHOD
    // ============================================================
    private async Task<(float Temperature, float Humidity, float Rainfall)> GetWeatherAsync(string location)
    {
        try
        {
            // Try to get seasonal weather first
            string season = GetCurrentSeason();
            var (temperature, humidity, rainfall) = await _weather.GetSeasonalWeatherAsync(
                location, season, 5);

            // Convert total rainfall to monthly average
            int monthsInSeason = season.ToLower() switch
            {
                "monsoon" => 5,
                "winter" => 6,
                "summer" => 4,
                _ => 5
            };

            float monthlyRainfall = rainfall / monthsInSeason;

            // Cap at dataset max (300mm)
            if (monthlyRainfall > 300)
            {
                monthlyRainfall = 300;
            }

            return (temperature, humidity, monthlyRainfall);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Seasonal weather failed, falling back to current weather");
            return await _weather.GetWeatherAsync(location);
        }
    }
    public Task<List<PredictionHistory>> GetHistoryAsync(int userId)
        => _predictions.GetByUserIdAsync(userId);

    private sealed class FlaskPredictionResponse
    {
        [JsonPropertyName("recommended_crop")]
        public string RecommendedCrop { get; set; } = string.Empty;

        [JsonPropertyName("confidence")]
        public float? Confidence { get; set; }
    }

    // Add these after the existing FlaskPredictionResponse class

    private sealed class FlaskMetricsResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("metrics")]
        public FlaskMetrics Metrics { get; set; } = new();
    }

    private sealed class FlaskMetrics
    {
        [JsonPropertyName("accuracy")]
        public double Accuracy { get; set; }

        [JsonPropertyName("precision")]
        public double Precision { get; set; }

        [JsonPropertyName("recall")]
        public double Recall { get; set; }

        [JsonPropertyName("f1_score")]
        public double F1Score { get; set; }

        [JsonPropertyName("confusion_matrix")]
        public FlaskConfusionMatrix ConfusionMatrix { get; set; } = new();

        [JsonPropertyName("total_samples")]
        public int TotalSamples { get; set; }

        [JsonPropertyName("n_classes")]
        public int NClasses { get; set; }
    }

    private sealed class FlaskConfusionMatrix
    {
        [JsonPropertyName("labels")]
        public List<string> Labels { get; set; } = new();

        [JsonPropertyName("matrix")]
        public List<List<int>> Matrix { get; set; } = new();
    }
    // ✅ ADD THIS NEW METHOD
    private async Task<PythonPredictionResponse> GetPredictionWithFertilizerAsync(PredictRequestDto dto)
    {
        // Get weather data (your existing logic)
        var weather = await GetWeatherAsync(dto.Location);

        // ✅ CORRECT FIELD NAMES (matches Python API)
        var payload = new
        {
            nitrogen = dto.Nitrogen,
            phosphorus = dto.Phosphorus,
            potassium = dto.Potassium,
            temperature = weather.Temperature,
            humidity = weather.Humidity,
            ph = dto.Ph,
            rainfall = weather.Rainfall
        };

        var client = _httpFactory.CreateClient("PythonML");
        var response = await client.PostAsJsonAsync("/predict", payload);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<PythonPredictionResponse>();
    }


}