using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;
using System.Text.Json;

namespace JobTracker.Server.Interfaces
{
    public interface IJobApplicationProcessor
    {
        Task<List<JobApplicationResponse>> GetAllAsync();
        Task<List<JobApplicationResponse>> GetAgedApplications();
        Task<JobApplication> GetApplicationByID(int id);
        Task UpdateStatus(int id, JsonElement data);
        Task<JobStatsResponse> GetJobStats();
        Task SaveJobApplication(JobApplicationModel jobApplication);
    }
}
