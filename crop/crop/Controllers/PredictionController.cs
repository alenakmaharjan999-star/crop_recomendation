//using Microsoft.AspNetCore.Mvc;

//namespace crop.Controllers
//{
//    public class PredictionController : Controller
//    {
//        public IActionResult Index()
//        {
//            return View();
//        }
//    }
//}


// Controllers/PredictionController.cs
// Handles: POST /api/prediction/predict  → get crop recommendation
//          GET  /api/prediction/history   → get user's past predictions
// [Authorize] = React must send JWT token in header

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using crop.DTOs;
using crop.Services;
using crop.Validation;
using System.Security.Claims;

namespace EKrishiAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]   // all endpoints here require login
public class PredictionController : ControllerBase
{
    private readonly IPredictionService _predictions;

    public PredictionController(IPredictionService predictions)
        => _predictions = predictions;

    // React sends: { N, P, K, Ph, Location }
    // This controller asks PredictionService to:
    //   1. fetch weather for Location
    //   2. call Python Flask with all 7 values
    //   3. save result to SQL Server
    //   4. return { predictedCrop, confidence }
    [HttpPost("predict")]
    public async Task<IActionResult> Predict(PredictRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(entry => entry.Value?.Errors.Count > 0)
                .ToDictionary(
                    entry => entry.Key,
                    entry => entry.Value!.Errors.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(new { error = "Invalid prediction input.", errors });
        }

        // Store the canonical spelling of the location instead of raw user text
        LocationCatalog.TryNormalize(dto.Location, out var location);
        dto.Location = location;

        try
        {
            // ✅ CHANGE: Call the NEW method that returns metrics
            var result = await _predictions.PredictWithMetricsAsync(dto, GetUserId());

            // ✅ CHANGE: Return prediction + ALL metrics
            return Ok(new
            {
                predictedCrop = result.PredictedCrop,
                confidence = result.Confidence,
                accuracy = result.Accuracy,
                precision = result.Precision,
                recall = result.Recall,
                f1Score = result.F1Score,
                confusionMatrix = result.ConfusionMatrix
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // Returns all past predictions for the logged-in user
    [HttpGet("history")]
    public async Task<IActionResult> History()
    {
        var history = await _predictions.GetHistoryAsync(GetUserId());
        return Ok(history);
    }

    // Locations the prediction form is allowed to submit
    [HttpGet("locations")]
    [AllowAnonymous]
    public IActionResult Locations() => Ok(LocationCatalog.Locations);

    // Reads UserId from the JWT token (set during login)
    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}