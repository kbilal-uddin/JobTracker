using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;

namespace JobTracker.Server.Interfaces
{
    public interface IJobApplicationHandler
    {
        Task<List<JobApplication>> GetAllAsync();
        Task<List<JobApplication>> GetAgedApplications();
        Task<JobApplication> GetApplicationByID(int id);
        Task UpdateStatus(int id, string status);
        Task<JobStatsResponse> GetJobStats();
        Task SaveJobApplication(JobApplicationModel jobApplication);
    }
}
