namespace JobTracker.Server.Models.Database
{
    public class Interview
    {
        public int Id { get; set; }  // ✅ Primary key

        public int JobApplicationId { get; set; }  // Foreign key

        public DateTime InterviewDate { get; set; }
        public string InterviewRound { get; set; }
        public string Notes { get; set; }
        public string Interviewer { get; set; }
        public bool IsPassThrough { get; set; }

        public JobApplication? JobApplication { get; set; }
    }
}
