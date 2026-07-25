using crop.Services;
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
        try
        {
            var (temperature, humidity, rainfall) = await _weather.GetWeatherAsync(location);

            return Ok(new
            {
                location,
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
