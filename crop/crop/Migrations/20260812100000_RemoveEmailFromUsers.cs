using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crop.Migrations
{
    [Microsoft.EntityFrameworkCore.Migrations.Migration("20260812100000_RemoveEmailFromUsers")]
    public partial class RemoveEmailFromUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // No-op: Email column is not used in the current schema.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No-op
        }
    }
}
