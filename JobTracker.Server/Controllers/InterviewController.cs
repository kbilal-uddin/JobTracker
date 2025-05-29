using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JobTracker.Server.Data;
using JobTracker.Server.Models.Database; // Adjust namespace to match your structure

namespace JobTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InterviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Interview
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterviews()
        {
            return await _context.Interview.ToListAsync();
        }

        // GET: api/Interview/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterview(int id)
        {
            var interviews = await _context.Interview
                .Where(i => i.JobApplicationId == id)
                .ToListAsync();

            if (interviews == null || !interviews.Any())
            {
                return NotFound();
            }

            return Ok(interviews);
        }

        // GET: api/Interview/ByApplication/5
        [HttpGet("ByApplication/{jobApplicationId}")]
        public async Task<ActionResult<IEnumerable<Interview>>> GetByJobApplication(int jobApplicationId)
        {
            return await _context.Interview
                .Where(i => i.JobApplicationId == jobApplicationId)
                .ToListAsync();
        }

        // POST: api/Interview
        [HttpPost]
        public async Task<ActionResult<Interview>> PostInterview(Interview interview)
        {
            _context.Interview.Add(interview);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetInterview), new { id = interview.Id }, interview);
        }

        // PUT: api/Interview/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInterview(int id, Interview interview)
        {
            if (id != interview.Id)
                return BadRequest();

            _context.Entry(interview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InterviewExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Interview/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInterview(int id)
        {
            var interview = await _context.Interview.FindAsync(id);
            if (interview == null)
                return NotFound();

            _context.Interview.Remove(interview);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InterviewExists(int id)
        {
            return _context.Interview.Any(e => e.Id == id);
        }
    }
}
