using crop.Data;
using crop.Repositories;
using crop.Services;
using EKrishiAPI.Repositories;
using EKrishiAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Connect to SQL Server using connection string from appsettings.json
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// HTTP client for calling Python Flask (http://localhost:5000)
// Named "PythonML" — used in PredictionService
builder.Services.AddHttpClient("PythonML", c =>
    c.BaseAddress = new Uri("http://localhost:5000"));

// HTTP client for WeatherService (calls OpenWeather API)
builder.Services.AddHttpClient<IWeatherService, WeatherService>();

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPredictionRepository, PredictionRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPredictionService, PredictionService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

// JWT authentication — validates token React sends in Authorization header
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Allow React (localhost:3000) to call this API
builder.Services.AddCors(opt =>
    opt.AddPolicy("AllowReact", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");        // must be before UseAuth
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();