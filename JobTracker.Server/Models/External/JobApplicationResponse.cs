namespace JobTracker.Server.Models.External
{
    public class JobApplicationResponse
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public DateTime AppliedDate { get; set; }
        public string? JobLink { get; set; }
        public List<string> Documents { get; set; } = new List<string>();
        public string Status { get; set; }
        public string? Comments { get; set; }
        public string? ATSScore { get; set; }
        public int? NoOfYearsExperience { get; set; }
        public bool IsReferred { get; set; }
        public string? ReferredBy { get; set; }
        public string? Platform { get; set; }
        public bool? IsGermanRequired { get; set; }
        public string? RequiredGermanLevel { get; set; }
    }
}
