// Repositories/UserRepository.cs
// ONLY talks to AppDbContext — no business logic here
// Interface + Implementation in same file for simplicity

using crop.Data;
using crop.Models;
using Microsoft.EntityFrameworkCore;

namespace crop.Repositories;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task AddAsync(User user);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    // Used by AuthService.LoginAsync and RegisterAsync
    // Returns null if user not found
    public Task<User?> GetByUsernameAsync(string username)
        => _db.Users.FirstOrDefaultAsync(u => u.Username == username);

    // Inserts new row into Users table
    public async Task AddAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
    }
}
