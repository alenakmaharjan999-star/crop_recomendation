using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crop.Migrations
{
    [Microsoft.EntityFrameworkCore.Migrations.Migration("20260807100000_RenameUsernameToEmail")]
    public partial class RenameUsernameToEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add Email column (nullable initially)
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(255)",
                nullable: true);

            // Copy existing Username values into Email
            migrationBuilder.Sql("UPDATE Users SET Email = Username WHERE Email IS NULL");

            // Make Email NOT NULL
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldNullable: true);

            // Create unique index on Email
            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            // Drop Username column if it exists
            migrationBuilder.Sql(@"
IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'Username' AND Object_ID = Object_ID(N'Users'))
BEGIN
    ALTER TABLE Users DROP COLUMN Username
END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add Username back (nullable)
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(50)",
                nullable: true);

            // Copy Email back to Username
            migrationBuilder.Sql("UPDATE Users SET Username = Email WHERE Username IS NULL");

            // Drop unique index on Email
            migrationBuilder.DropIndex(name: "IX_Users_Email", table: "Users");

            // Drop Email column
            migrationBuilder.DropColumn(name: "Email", table: "Users");
        }
    }
}
