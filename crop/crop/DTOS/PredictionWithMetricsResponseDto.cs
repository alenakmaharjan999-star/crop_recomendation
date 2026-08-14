// DTOs/PredictionWithMetricsResponseDto.cs
namespace crop.DTOs;

public class PredictionWithMetricsResponseDto
{
    public string PredictedCrop { get; set; }
    public double Confidence { get; set; }
    public double Accuracy { get; set; }
    public double Precision { get; set; }
    public double Recall { get; set; }
    public double F1Score { get; set; }
    public ConfusionMatrixData ConfusionMatrix { get; set; }
}

public class ConfusionMatrixData
{
    public List<string> Labels { get; set; }
    public List<List<int>> Matrix { get; set; }
}