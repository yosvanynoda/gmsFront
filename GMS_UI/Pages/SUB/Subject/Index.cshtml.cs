using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.SUB;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.SUB.Subject
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly ISettings _settings;

        public IndexModel(ILogger<IndexModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public void OnGet()
        {
        }

        public async Task<JsonResult> OnPostAsync()
        {
            try
            {
                _logger.LogInformation("OnPostAsync called for Subject list");

                var requestData = new SubjectListRequest
                {
                    CompanyId = 1,
                    SiteId = 1
                };

                BaseResponse subjectList = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/SUB/getsubjectlist", "Subject List", "", requestData);

                if (subjectList == null || subjectList.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Subject List",
                        success = false,
                        data = new List<SubjectList>()
                    });
                }

                if (subjectList.Success && subjectList.Data != null)
                {
                    List<SubjectList> result = JsonConvert.DeserializeObject<List<SubjectList>>(subjectList.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Subject List was read successfully",
                        success = true,
                        data = result
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = subjectList.Message,
                        success = false,
                        data = new List<SubjectList>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<SubjectList>()
                });
            }
        }

        public async Task<JsonResult> OnPostCreateRandomCodeAsync([FromBody] CreateRandomCodeRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostCreateRandomCodeAsync called for SubjectId: {SubjectId}, StudioId: {StudioId}, Code: {Code}",
                    request.SubjectId, request.StudioId, request.Code);

                if (request.SubjectId <= 0 || request.StudioId <= 0)
                {
                    _logger.LogWarning("Invalid request - SubjectId: {SubjectId}, StudioId: {StudioId}",
                        request.SubjectId, request.StudioId);
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid SubjectId or StudioId"
                    });
                }

                if (string.IsNullOrWhiteSpace(request.Code))
                {
                    _logger.LogWarning("Random code is required");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Random code is required"
                    });
                }

                _logger.LogInformation("Calling CreateRandomCode API - SubjectId: {SubjectId}, StudioId: {StudioId}, Code: {Code}, CompanyId: {CompanyId}",
                    request.SubjectId, request.StudioId, request.Code, request.CompanyId);

                // Call the CreateRandomCode API
                var result = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    "api/v1/SUB/createrandomcode",
                    "Create Random Code",
                    "",
                    request
                );

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Random code assigned successfully."
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Failed to assign random code."
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostCreateRandomCodeAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }
    }

    public class SubjectListRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
    }
}
