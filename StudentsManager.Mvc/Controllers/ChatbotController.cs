using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentsManager.Mvc.Persistence;

namespace StudentsManager.Mvc.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatbotController(ManagerDbContext managerDbContext) : ControllerBase
{
    // GET: api/chatbot/examination-answers/022a6007-f33c-47c3-b811-08de88b121f2
    [HttpGet("examination-answers/{studentId}")]
    public async Task<IActionResult> Get([FromRoute] Guid studentId)
    {
        var result = await managerDbContext.ExaminationAnswers
            .Where(answer => answer.UserId == studentId)
            .ToListAsync();

        return Ok(result);
    }

}
