using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddInterviewAndApplicationFields_V3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPassThrough",
                table: "Interview",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPassThrough",
                table: "Interview");
        }
    }
}
