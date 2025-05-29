using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Server.Migrations
{
    /// <inheritdoc />
    public partial class ATS_SCORE_UPDATE_TABLE_JOBAPPLICATION : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ATSScore",
                table: "JobApplications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ATSScore",
                table: "JobApplications");
        }
    }
}
