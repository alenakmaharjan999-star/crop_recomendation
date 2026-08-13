using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crop.Migrations
{
    [Microsoft.EntityFrameworkCore.Migrations.Migration("20260813080000_AddConfidenceToPredictionHistory")]
    public partial class AddConfidenceToPredictionHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Confidence",
                table: "PredictionHistory",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Confidence",
                table: "PredictionHistory");
        }
    }
}
