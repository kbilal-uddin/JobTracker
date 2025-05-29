namespace JobTracker.Server.Models.External
{
    public class JobStatsResponse
    {
        public int TotalJobs { get; set; }
        public int TotalResumeRejected { get; set; }
        public int TotalRejected { get; set; }
        public int TotalAppliedJobs { get; set; }
        public int TotalInterviewCalls { get; set; }
        public WeeklyStats weeklyStats { get; set; }
        public List<JobsPerDayResponse> jobsPerDayResponses { get; set; }
    }
}
