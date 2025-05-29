using JobTracker.Server.Data;
using JobTracker.Server.Interfaces;
using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace JobTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJobApplicationProcessor _processor;
        private readonly string _storagePath = "D:\\Personal\\JobTrackerApplicationFiles\\";

        public JobApplicationsController(ApplicationDbContext context, IJobApplicationProcessor processor)
        {
            _context = context;
            _processor = processor;

            // Ensure the folder exists
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        #region Structured Code
        [HttpPost]
        public async Task<ActionResult<JobApplication>> PostJobApplication([FromForm] JobApplicationModel jobApplication)
        {
            try
            {
                await _processor.SaveJobApplication(jobApplication);

                return Created();
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<JobApplicationResponse>>> GetAllJobApplications()
        {
            try
            {
                var jobApplications = await _processor.GetAllAsync();
                if (jobApplications == null || !jobApplications.Any())
                    return NotFound("No job applications found.");

                return Ok(jobApplications);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("aged")]
        public async Task<ActionResult<List<JobApplicationResponse>>> GetAllAgedJobApplications()
        {
            try
            {
                var jobApplications = await _processor.GetAgedApplications();
                if (jobApplications == null || !jobApplications.Any())
                    return NotFound("No job applications found.");

                return Ok(jobApplications);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("job-stats")]
        public async Task<IActionResult> GetJobStats()
        {
            try
            {
                var stats = await _processor.GetJobStats();
                if (stats == null)
                    return NotFound("No job stats found.");

                return Ok(stats);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplication>> GetJobApplication(int id)
        {
            try
            {
                var jobApplications = await _processor.GetApplicationByID(id);
                return Ok(jobApplications);
            }
            catch (ApplicationException ex)
            {
                //Since raising this error from processor so return not found from here makes sense as of now - KBU
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] JsonElement data)
        {

            try
            {
                await _processor.UpdateStatus(id, data);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            return NoContent();
        }

        #endregion

        // DELETE: api/JobApplications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobApplication(int id)
        {
            var jobApplication = await _context.JobApplications.FindAsync(id);

            if (jobApplication == null)
            {
                return NotFound();
            }

            // Delete associated files (if any)
            if (jobApplication.Documents != null && jobApplication.Documents.Any())
            {
                foreach (var filePath in jobApplication.Documents)
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath); // Delete the file from storage
                    }
                }
            }

            // Remove the job application from the database
            _context.JobApplications.Remove(jobApplication);
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 No Content status after successful deletion
        }
    }
}
