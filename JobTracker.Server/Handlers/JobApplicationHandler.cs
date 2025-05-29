using AutoMapper;
using JobTracker.Server.Data;
using JobTracker.Server.Interfaces;
using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Server.Handlers
{
    public class JobApplicationHandler: IJobApplicationHandler
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _storagePath = "D:\\Personal\\JobTrackerApplicationFiles\\"; //ToDo - should be dynamic, add in appsettings.json

        public JobApplicationHandler(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        public async Task SaveJobApplication(JobApplicationModel jobApplication)
        {
            try
            {
                var existingApplication = _context.JobApplications
                    .FirstOrDefault(ja => ja.CompanyName == jobApplication.CompanyName);


                if (existingApplication != null)
                {
                    int version = 1;
                    var newFileName = $"{jobApplication.CompanyName}_{jobApplication.AppliedDate:yyyyMMdd}_{version}";
                    while (_context.JobApplications.Any(ja => ja.CompanyName == newFileName))
                    {
                        version++;
                        newFileName = $"{jobApplication.CompanyName}_{jobApplication.AppliedDate:yyyyMMdd}_{version}";
                    }
                    jobApplication.CompanyName = newFileName;
                }

                if (jobApplication.DocumentFile != null)
                {
                    var filePaths = new List<string>();

                    foreach (var file in jobApplication.DocumentFile)
                    {
                        if (file.Length > 0)
                        {
                            var fileName = $"{jobApplication.CompanyName}_{Path.GetFileName(file.FileName)}";
                            var filePath = Path.Combine(_storagePath, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            filePaths.Add(filePath); // Save the path of the uploaded file
                        }
                    }

                    jobApplication.Documents = filePaths;
                }

                var entity = _mapper.Map<JobApplication>(jobApplication);
                _context.JobApplications.Add(entity);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("Error occured while saving data");
            }
        }

        public async Task<List<JobApplication>> GetAllAsync()
        {
            return await _context.JobApplications
            .OrderByDescending(a => a.AppliedDate)
            .ThenByDescending(a => a.Id)
            .ToListAsync();
        }

        public async Task<JobStatsResponse> GetJobStats()
        {
            var jobApplications = await _context.JobApplications.ToListAsync();
            var interviews = await _context.Interview.ToListAsync();

            var response = new JobStatsResponse
            {
                TotalJobs = jobApplications.Count,
                TotalResumeRejected = jobApplications.Count(j =>
                    j.Status != null && j.Status.Contains("Resume Rejected", StringComparison.OrdinalIgnoreCase)),
                TotalRejected = jobApplications.Count(j =>
                    j.Status != null && j.Status.Equals("Rejected", StringComparison.OrdinalIgnoreCase)),
                TotalAppliedJobs = jobApplications.Count(j =>
                    string.Equals(j.Status, "Applied", StringComparison.OrdinalIgnoreCase))
            };

            response.TotalInterviewCalls = interviews
                .Select(i => i.JobApplicationId)
                .Distinct()
                .Count();

            response.weeklyStats = CalculateJobStats(jobApplications);

            response.jobsPerDayResponses = await _context.JobApplications
           .GroupBy(j => j.AppliedDate.Date)
           .Select(g => new JobsPerDayResponse
           {
               Date = g.Key,
               Count = g.Count()
           })
               .OrderBy(r => r.Date)
               .ToListAsync();

            return response;
        }

        public async Task<List<JobApplication>> GetAgedApplications()
        {
            return await _context.JobApplications
            .Where(a => a.AppliedDate <= DateTime.UtcNow.AddDays(-7) && (a.Status.ToLower() != "resume rejected" && a.Status.ToLower() != "rejected"))
            .OrderBy(a => a.AppliedDate)
            .ThenBy(a => a.Id)
            .ToListAsync();
        }

        public async Task<JobApplication> GetApplicationByID(int id)
        {
            //Will handle null in processor - KBU
            return await _context.JobApplications.FindAsync(id);
        }

        public async Task UpdateStatus(int id, string status)
        {
            if(string.IsNullOrEmpty(status))
                throw new ApplicationException("Status is missing. Please select status");    

            var jobApp = await _context.JobApplications.FindAsync(id);

            if (jobApp is null)
                throw new ApplicationException("Invalid application id, no such id found. Resulting in unable to update status");

            jobApp.Status = status;
            await _context.SaveChangesAsync();
        }



        #region Helper Methods

        public WeeklyStats CalculateJobStats(List<JobApplication> applications)
        {
            var today = DateTime.Today;
            var startOfLastWeek = today.AddDays(-6);

            var lastWeekApplications = applications
                .Where(app => app.AppliedDate.Date >= startOfLastWeek && app.AppliedDate.Date <= today)
                .ToList();

            int totalLastWeek = lastWeekApplications.Count;

            var daysWithApplications = lastWeekApplications
                .GroupBy(app => app.AppliedDate.Date)
                .Count();

            int averagePerDay = daysWithApplications > 0
                ? (int)Math.Round((double)totalLastWeek / daysWithApplications)
                : 0;

            return new WeeklyStats
            {
                TotalJobsApplied = totalLastWeek,
                AverageJobsAppliedPerDay = averagePerDay
            };
        }

        #endregion
    }
}
