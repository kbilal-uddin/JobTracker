using AutoMapper;
using JobTracker.Server.Interfaces;
using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;
using System.Text.Json;

namespace JobTracker.Server.Processors
{
    public class JobApplicationProcessor : IJobApplicationProcessor
    {
        private readonly IJobApplicationHandler _handler;
        private readonly IMapper _mapper;

        public JobApplicationProcessor(IJobApplicationHandler handler, IMapper mapper)
        {
            _handler = handler;
            _mapper = mapper;
        }

        public async Task<List<JobApplicationResponse>> GetAllAsync()
        {
            try
            {
                var entities = await _handler.GetAllAsync();
                var response = _mapper.Map<List<JobApplicationResponse>>(entities);

                return response;
            }
            catch (Exception ex)
            {
                // Log exception here, or handle it as needed
                throw new ApplicationException("An error occurred while fetching job applications.", ex);
            }
        }

        public async Task<List<JobApplicationResponse>> GetAgedApplications()
        {
            try
            {
                var entities = await _handler.GetAgedApplications();
                var response = _mapper.Map<List<JobApplicationResponse>>(entities);

                return response;
            }
            catch (Exception ex)
            {
                // Log exception here, or handle it as needed
                throw new ApplicationException("An error occurred while fetching job applications.", ex);
            }
        }

        public async Task<JobStatsResponse> GetJobStats()
        {
            try
            {
                return await _handler.GetJobStats();
            }
            catch (Exception ex)
            {
                // Log exception here, or handle it as needed
                throw new ApplicationException("An error occurred while fetching stats for job applications.", ex);
            }
        }

        public async Task SaveJobApplication(JobApplicationModel jobApplication)
        {
            try
            {
                await _handler.SaveJobApplication(jobApplication);
            }
            catch (Exception ex)
            {
                // Log exception here, or handle it as needed
                throw new ApplicationException("An error occurred while saving job application.", ex);
            }
        }

        public async Task<JobApplication> GetApplicationByID(int id)
        {

            try
            {
                var jobApplication = await _handler.GetApplicationByID(id);

                if (jobApplication == null)
                    throw new ApplicationException("No application found against the following id");
                else
                    return jobApplication;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving job application.", ex);
            }
        }

        public async Task UpdateStatus(int id, JsonElement data)
        {
            try
            {
                data.TryGetProperty("status", out var status);

                if (string.IsNullOrEmpty(status.GetString()))
                    throw new ApplicationException("Status is missing or invalid. Please select the valid status");

                await _handler.UpdateStatus(id, status.ToString());
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while updating status of job application.", ex);
            }

            
        }
    }
}
