using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class Added_Column_JobApplicationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comments",
                table: "JobApplications");
        }
    }
}
