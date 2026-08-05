// DTOs/PredictRequestDto.cs
// What React sends to /api/prediction/predict

namespace crop.DTOs;

public class PredictRequestDto
{
    public float Nitrogen { get; set; }
    public float Phosphorus { get; set; }
    public float Potassium { get; set; }
    public float Ph { get; set; }
    public float Temperature { get; set; }
    public float Humidity { get; set; }
    public float Rainfall { get; set; }
    public string Location { get; set; } = string.Empty;
}
