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
    public FertilizerRecommendation? FertilizerRecommendation { get; set; }
}

public class ConfusionMatrixData
{
    public List<string> Labels { get; set; }
    public List<List<int>> Matrix { get; set; }
}
public class FertilizerRecommendation
{
    public string Crop { get; set; } = string.Empty;
    public SoilNpk SoilNpk { get; set; } = new();
    public CropRequirement? CropRequirement { get; set; }
    public Deficit Deficit { get; set; } = new();
    public FertilizerRecommendationDetail Recommendation { get; set; } = new();
}

public class SoilNpk
{
    public double N { get; set; }
    public double P { get; set; }
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
    public double N { get; set; }
    public double P { get; set; }
    public double K { get; set; }
}

public class FertilizerRecommendationDetail
{
    public string Name { get; set; } = string.Empty;
    public string Npk { get; set; } = string.Empty;
    public int ApplicationRateKgPerHa { get; set; }
    public Deficit DeficientNutrients { get; set; } = new();
}