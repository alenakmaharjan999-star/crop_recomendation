using System.Net.Http;
using System.Text.Json;

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
            N = request.Nitrogen,
            P = request.Phosphorus,
            K = request.Potassium,
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
    public string RecommendedCrop { get; set; }
    public double Confidence { get; set; }
    public ModelPerformance ModelPerformance { get; set; }
}

public class ModelPerformance
{
    public double Accuracy { get; set; }
    public double Precision { get; set; }
    public double Recall { get; set; }
    public double F1Score { get; set; }
    public ConfusionMatrixData ConfusionMatrix { get; set; }
    // ❌ NO ClassificationReport here
    public int TotalSamples { get; set; }
    public int NClasses { get; set; }
}

public class ConfusionMatrixData
{
    public List<string> Labels { get; set; }
    public List<List<int>> Matrix { get; set; }
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