using StudentsManager.Mvc.Domain.Inputs.Students;
using StudentsManager.Mvc.Domain.Views.Students;

namespace StudentsManager.Mvc.Services.Students
{
    public interface IStudentsService
    {
        Task<List<StudentView?>> AllAsync();

        Task<StudentView?> GetByFacultyNumberAsync(string facultyNumber);

        Task<StudentView?> UpdatePictureAsync(UpdatePicture input);

        Task<StudentProfileView?> GetStudentProfileViewAsync(Guid studentId);
    }
}
