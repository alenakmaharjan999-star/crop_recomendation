using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

public class PythonApiService
{
    private readonly HttpClient _httpClient;
    private readonly string _pythonApiUrl = "http://localhost:5000";

    public PythonApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(_pythonApiUrl);
    }

    // Get prediction from Python
    public async Task<PythonPredictionResponse> GetPredictionAsync(PredictionRequest request)
    {
        var payload = new
        {
            nitrogen = request.Nitrogen,        // ← "nitrogen" not "N"
            phosphorus = request.Phosphorus,    // ← "phosphorus" not "P"
            potassium = request.Potassium,      // ← "potassium" not "K"
            temperature = request.Temperature,
            humidity = request.Humidity,
            ph = request.Ph,
            rainfall = request.Rainfall
        };

        var response = await _httpClient.PostAsJsonAsync("/predict", payload);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<PythonPredictionResponse>();
    }

    // Get metrics from Python
    public async Task<ModelPerformance> GetMetricsAsync()
    {
        var response = await _httpClient.GetAsync("/metrics");
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<MetricsApiResponse>();
        return result.Metrics;
    }
}

// Models for deserialization
public class PythonPredictionResponse
{
    [JsonPropertyName("recommended_crop")]
    public string RecommendedCrop { get; set; } = string.Empty;

    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }

    [JsonPropertyName("model_performance")]
    public ModelPerformance? ModelPerformance { get; set; }

    [JsonPropertyName("fertilizer_recommendation")]
    public FertilizerRecommendation? FertilizerRecommendation { get; set; }
}

public class ModelPerformance
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
    public ConfusionMatrixData? ConfusionMatrix { get; set; }

    [JsonPropertyName("total_samples")]
    public int TotalSamples { get; set; }

    [JsonPropertyName("n_classes")]
    public int NClasses { get; set; }
}

public class ConfusionMatrixData
{
    [JsonPropertyName("labels")]
    public List<string> Labels { get; set; } = new();

    [JsonPropertyName("matrix")]
    public List<List<int>> Matrix { get; set; } = new();
}

public class MetricsApiResponse
{
    public string Status { get; set; }
    public ModelPerformance Metrics { get; set; }
}

public class PredictionRequest
{
    public double Nitrogen { get; set; }
    public double Phosphorus { get; set; }
    public double Potassium { get; set; }
    public double Ph { get; set; }
    public double Temperature { get; set; }
    public double Humidity { get; set; }
    public double Rainfall { get; set; }
    public string Location { get; set; }
}

// ============================================================
// ✅ ADD THESE NEW CLASSES FOR FERTILIZER
// ============================================================

public class FertilizerRecommendation
{
    [JsonPropertyName("crop")]
    public string Crop { get; set; } = string.Empty;

    [JsonPropertyName("soil_npk")]
    public SoilNpk? SoilNpk { get; set; }

    [JsonPropertyName("crop_requirement")]
    public CropRequirement? CropRequirement { get; set; }

    [JsonPropertyName("deficit")]
    public Deficit? Deficit { get; set; }

    [JsonPropertyName("recommendation")]
    public FertilizerRecommendationDetail? Recommendation { get; set; }
}

public class SoilNpk
{
    [JsonPropertyName("N")]
    public double N { get; set; }

    [JsonPropertyName("P")]
    public double P { get; set; }

    [JsonPropertyName("K")]
    public double K { get; set; }
}

public class CropRequirement
{
    public double N { get; set; }
    public double P { get; set; }
    public double K { get; set; }
}

public class Deficit
{
    [JsonPropertyName("N")]
    public double N { get; set; }

    [JsonPropertyName("P")]
    public double P { get; set; }

    [JsonPropertyName("K")]
    public double K { get; set; }
}

public class FertilizerRecommendationDetail
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("npk")]
    public string Npk { get; set; } = string.Empty;

    [JsonPropertyName("rate_kg_per_ha")]
    public int ApplicationRateKgPerHa { get; set; }

    [JsonPropertyName("deficient_nutrients")]
    public Deficit? DeficientNutrients { get; set; }

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = string.Empty;
}