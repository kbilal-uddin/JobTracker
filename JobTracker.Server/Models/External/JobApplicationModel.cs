using JobTracker.Server.Models.Database;

namespace JobTracker.Server.Models.External
{
    public class JobApplicationModel : JobApplication
    {
        public IFormFileCollection DocumentFile { get; set; }
    }
}
