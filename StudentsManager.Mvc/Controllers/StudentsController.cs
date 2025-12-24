using Microsoft.AspNetCore.Mvc;
using StudentsManager.Mvc.Domain.Inputs.Students;
using StudentsManager.Mvc.Services.CourseExaminations;
using StudentsManager.Mvc.Services.Students;

namespace StudentsManager.Mvc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController(IStudentsService service, IStudentCourseExaminationService examinationService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var isAuthorized = Request.Headers.TryGetValue("Authorization", out var authorizationHeader);
            if (!isAuthorized) return Unauthorized();
            var authBytes = "guest:guest"u8.ToArray();
            var base64Auth = Convert.ToBase64String(authBytes);

            var authorizationValue = authorizationHeader.ToString().Split(' ')[1];
            if (authorizationValue != base64Auth) return Unauthorized();

            return Ok(await service.AllAsync());
        }

        [HttpGet("{facultyNumber}")]
        public async Task<IActionResult> GetByFacultyNumber([FromRoute] string facultyNumber)
        {
            var result = await service.GetByFacultyNumberAsync(facultyNumber);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("picture")]
        public async Task<IActionResult> UpdatePicture([FromBody] UpdatePicture input)
        {
            var result = await service.UpdatePictureAsync(input);
            if (result == null) return BadRequest();
            return Ok();
        }

        [HttpPatch("examination")]
        public async Task<IActionResult> SetStudentExaminationScore([FromBody] StudentExaminationScore input)
        {
            var isAuthorized = Request.Headers.TryGetValue("classified", out var authorizationHeader);
            if (!isAuthorized || authorizationHeader != "s3cR37") return Unauthorized();
            await examinationService.SetScoreAsync(input.UserId, input.Type, input.Score);
            return Ok();
        }

        [HttpGet("profile/{studentId}")]
        public async Task<IActionResult> GetStudentProfileView([FromRoute] Guid studentId)
        {
            var result = await service.GetStudentProfileViewAsync(studentId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
