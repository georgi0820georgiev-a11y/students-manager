using System.Globalization;
using Microsoft.EntityFrameworkCore;
using StudentsManager.Mvc.Domain.Entities;
using StudentsManager.Mvc.Persistence;
using StudentsManager.Mvc.Services.Storage;

namespace StudentsManager.Mvc.Services.CourseExaminations
{
    public class ExaminationUploadService : IExaminationUploadService
    {
        private readonly ManagerDbContext _dbContext;
        private readonly IStorageService _storageService;

        public ExaminationUploadService(ManagerDbContext dbContext, IStorageService storageService)
        {
            _dbContext = dbContext;
            _storageService = storageService;
        }

        public Task<List<StudentCourseExaminationUpload>> GetAsync(Guid studentExaminationId)
        {
            return _dbContext
                .StudentExaminationUploads
                .Where(upload => upload.StudentCourseExaminationId == studentExaminationId)
                .ToListAsync();
        }

        public async Task<StudentCourseExaminationUpload> AttachFileAsync(
            Guid studentExaminationId,
            string examinationType,
            IFormFile file,
            Guid userId)
        {
            // Handle file
            var random = new Random();
            var randomValue = random.Next(0, 5000);
            var examinationId = studentExaminationId.ToString()[..8];
            var fileName =
                $"exm-{examinationType.ToLower(CultureInfo.CurrentCulture)}-{examinationId}-{randomValue}-{file.FileName}";

            await _storageService.UploadToContainerAsync(
                userId.ToString(),
                file.OpenReadStream(),
                fileName);

            // Handle File Entity
            var entity = new StudentCourseExaminationUpload
            {
                CreatedAtUtc = DateTimeOffset.UtcNow,
                Extension = file.ContentType,
                StudentCourseExaminationId = studentExaminationId,
                FileName = fileName,
                Path = _storageService.PathBasis + userId + "/" + fileName
            };
            await _dbContext.StudentExaminationUploads.AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            // Handle parent entity
            var studentCourseExamination = await _dbContext
                .StudentCourseExaminations
                .SingleOrDefaultAsync(examination => examination.Id == studentExaminationId);

            if (studentCourseExamination.Score == 5) return entity;

            studentCourseExamination.Score = 5;
            _dbContext.StudentCourseExaminations.Update(studentCourseExamination);
            await _dbContext.SaveChangesAsync();

            return entity;
        }
    }
}
