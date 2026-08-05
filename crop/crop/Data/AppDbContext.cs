// Data/AppDbContext.cs
// Entity Framework Core bridge between C# models and SQL Server
// DbSet = one property per table
// OnModelCreating = configure constraints (unique, FK)

using crop.Models;
using Microsoft.EntityFrameworkCore;

namespace crop.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<PredictionHistory> PredictionHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Explicitly define primary keys
        modelBuilder.Entity<User>()
            .HasKey(u => u.UserId);

        modelBuilder.Entity<PredictionHistory>()
            .HasKey(p => p.PredictionId);

        // Unique username
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // FK relationship
        modelBuilder.Entity<PredictionHistory>()
            .HasOne(p => p.User)
            .WithMany(u => u.Predictions)
            .HasForeignKey(p => p.UserId);
    }
}