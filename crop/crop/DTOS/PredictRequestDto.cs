// DTOs/PredictRequestDto.cs
// What React sends to /api/prediction/predict
// Ranges mirror the ML training dataset (Crop_recommendation.csv).

using System.ComponentModel.DataAnnotations;
using crop.Validation;

namespace crop.DTOs;

public class PredictRequestDto
{
    [Range(0d, 140d, ErrorMessage = "Nitrogen (N) must be between 0 and 140 kg/ha.")]
    public float Nitrogen { get; set; }

    [Range(0d, 145d, ErrorMessage = "Phosphorus (P) must be between 0 and 145 kg/ha.")]
    public float Phosphorus { get; set; }

    [Range(0d, 205d, ErrorMessage = "Potassium (K) must be between 0 and 205 kg/ha.")]
    public float Potassium { get; set; }

    [Range(0d, 14d, ErrorMessage = "Soil pH must be between 0 and 14.")]
    public float Ph { get; set; }


    [Required(ErrorMessage = "Location is required.")]
    [ValidLocation]
    public string Location { get; set; } = string.Empty;
}
