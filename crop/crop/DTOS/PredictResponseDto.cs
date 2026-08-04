namespace crop.DTOs;

public class PredictResponseDto
{
    public string PredictedCrop { get; set; } = string.Empty;
    public float Confidence { get; set; }
}
