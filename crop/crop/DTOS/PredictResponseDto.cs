// DTOs/PredictResponseDto.cs
// What ASP.NET Core sends BACK to React after prediction
// Also used internally to read Flask's response

using System.Text.Json.Serialization;

namespace crop.DTOs;

public class PredictResponseDto
{
    // React receives: { "predictedCrop": "Rice", "confidence": 94.2 }
    // Shown on the Result page
    [JsonPropertyName("recommended_crop")]
    public string PredictedCrop { get; set; } = string.Empty;
    public float Confidence { get; set; }
}