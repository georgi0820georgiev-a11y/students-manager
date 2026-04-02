using System.Text;
using System.Text.Json;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OpenAI.Chat;
using StudentsManager.Mvc.Domain.Entities;
using StudentsManager.Mvc.Persistence;
using StudentsManager.Mvc.Settings;

namespace StudentsManager.Mvc.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChatbotController(
    ManagerDbContext managerDbContext,
    IOptions<ServiceBusSettings> options)
    : ControllerBase
{
    private const string SystemPrompt = """
                                        You are a senior JavaScript quiz evaluator. Your task is to analyze the given quiz answers and provide:
                                        1. A grade between 2 and 6.
                                        2. Overall feedback summarizing the performance.
                                        
                                        Respond in JSON format using the structure below:
                                        {
                                          "grade": <2-6>,
                                          "overallFeedback": "<summary>"
                                        }
                                        """;

    [HttpGet("examination-answers/{studentId:guid}")]
    public async Task<IActionResult> GetByStudent([FromRoute] Guid studentId, CancellationToken cancellationToken)
    {
        var result = await managerDbContext.ExaminationAnswers
            .AsNoTracking()
            .Where(answer => answer.UserId == studentId)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HttpPost("examination-answers")]
    public async Task<IActionResult> EvaluateAnswers([FromBody] ChatbotExaminationInput input, CancellationToken cancellationToken)
    {
        if (input.Answers.Length == 0)
            return BadRequest("Answers cannot be empty.");

        var settings = options.Value;
        var azureClient = new AzureOpenAIClient(new Uri(settings.AzureConnectionString), new AzureKeyCredential(settings.QueueName));
        var chatClient = azureClient.GetChatClient("gpt-4.1-nano");

        var serializedAnswers = JsonSerializer.Serialize(input.Answers);
        var userPrompt = $"Evaluate these JavaScript quiz answers:\n{serializedAnswers}";
        var responseText = string.Empty;
        var errorMessage = string.Empty;

        try
        {
            var requestOptions = new ChatCompletionOptions
            {
                Temperature = 1.0f,
                TopP = 1.0f,
                FrequencyPenalty = 0.0f,
                PresencePenalty = 0.0f,
                MaxOutputTokenCount = 13107
            };

            var response = await chatClient.CompleteChatAsync(
            [
                new SystemChatMessage(SystemPrompt),
                new UserChatMessage(userPrompt)
            ],
            requestOptions, cancellationToken);

            var sb = new StringBuilder();
            foreach (var part in response.Value.Content)
            {
                sb.Append(part.Text);
            }

            responseText = sb.ToString();
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
        }

        var entity = new ExaminationAnswer
        {
            Id = Guid.NewGuid(),
            UserId = input.UserId,
            CreatedOn = DateTime.UtcNow,
            Result = serializedAnswers,
            ContentType = "chatbot",
            WasSuccessfullyProcessed = !string.IsNullOrEmpty(responseText),
            Form = responseText,
            ErrorMessage = errorMessage
        };

        await managerDbContext.AddAsync(entity, cancellationToken);
        await managerDbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity);
    }
}

public record ChatbotAnswerItem(string QuestionId, string QuestionText, string Answer);

public record ChatbotExaminationInput(Guid UserId, ChatbotAnswerItem[] Answers);
