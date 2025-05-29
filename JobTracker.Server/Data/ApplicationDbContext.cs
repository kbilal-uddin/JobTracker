using Microsoft.EntityFrameworkCore;
using JobTracker.Server.Models.Database;

namespace JobTracker.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<Interview> Interview { get; set; }
    }
}
