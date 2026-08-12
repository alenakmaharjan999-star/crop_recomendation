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
            // Migration intentionally left blank to remove legacy Email renaming operations.
            // Username is the primary identifier; no Email column will be added.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No-op
        }
    }
}
