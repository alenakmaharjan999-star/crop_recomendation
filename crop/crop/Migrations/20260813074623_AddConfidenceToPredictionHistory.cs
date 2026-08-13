using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crop.Migrations
{
    /// <inheritdoc />
    public partial class AddConfidenceToPredictionHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Guarded because databases created by the old EnsureCreated() startup are
            // baselined at InitialCreate but may already carry the column.
            migrationBuilder.Sql(
                @"IF COL_LENGTH('PredictionHistory', 'Confidence') IS NULL
                      ALTER TABLE [PredictionHistory]
                      ADD [Confidence] real NOT NULL DEFAULT 0;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Confidence",
                table: "PredictionHistory");
        }
    }
}
