// Repositories/PredictionRepository.cs
// ONLY talks to AppDbContext — no business logic here
// Used by PredictionService after getting ML result

using crop.Data;
using crop.Models;
using Microsoft.EntityFrameworkCore;

namespace EKrishiAPI.Repositories;

public interface IPredictionRepository
{
    Task AddAsync(PredictionHistory entry);
    Task<List<PredictionHistory>> GetByUserIdAsync(int userId);
}

public class PredictionRepository : IPredictionRepository
{
    private readonly AppDbContext _db;
    public PredictionRepository(AppDbContext db) => _db = db;

    // Inserts one row to PredictionHistory table
    // Called every time a crop is predicted
    public async Task AddAsync(PredictionHistory entry)
    {
        _db.PredictionHistory.Add(entry);
        await _db.SaveChangesAsync();
    }

    // Returns all predictions for a specific user
    // Newest first — shown on History page in React
    public Task<List<PredictionHistory>> GetByUserIdAsync(int userId)
        => _db.PredictionHistory
              .Where(p => p.UserId == userId)
              .OrderByDescending(p => p.CreatedAt)
              .ToListAsync();
}