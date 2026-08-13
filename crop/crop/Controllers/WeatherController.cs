using crop.Services;
using crop.Validation;
using Microsoft.AspNetCore.Mvc;

namespace crop.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly IWeatherService _weather;

    public WeatherController(IWeatherService weather) => _weather = weather;

    [HttpGet("current")]
    public async Task<IActionResult> Current([FromQuery] string location = "Kathmandu")
    {
        if (!LocationCatalog.TryNormalize(location, out var normalized))
            return BadRequest(new
            {
                error = $"'{location}' is not a recognised district or city."
            });

        try
        {
            var (temperature, humidity, rainfall) = await _weather.GetWeatherAsync(normalized);

            return Ok(new
            {
                location = normalized,
                temperature,
                humidity,
                rainfall,
                condition = "Current"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
