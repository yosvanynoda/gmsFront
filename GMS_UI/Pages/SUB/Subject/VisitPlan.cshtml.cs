using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.SUB;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.SUB.Subject
{
    public class VisitPlanModel : PageModel
    {
        private readonly ILogger<VisitPlanModel> _logger;
        private readonly ISettings _settings;

        public VisitPlanModel(ILogger<VisitPlanModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [BindProperty(SupportsGet = true)]
        public int SubjectId { get; set; }

        [BindProperty(SupportsGet = true)]
        public int StudyId { get; set; }

        [BindProperty(SupportsGet = true)]
        public string ReturnUrl { get; set; } = "/SUB/Subject/Index";

        public void OnGet()
        {
            _logger.LogInformation("VisitPlan OnGet - SubjectId: {SubjectId}, StudyId: {StudyId}", SubjectId, StudyId);
        }

        public async Task<JsonResult> OnPostGetVisitPlanDataAsync([FromBody] VisitPlanRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetVisitPlanDataAsync called for SubjectId: {SubjectId}, StudyId: {StudyId}",
                    request.SubjectId, request.StudyId);

                if (request.SubjectId <= 0 || request.StudyId <= 0)
                {
                    _logger.LogWarning("Invalid request - SubjectId: {SubjectId}, StudyId: {StudyId}",
                        request.SubjectId, request.StudyId);
                    return new JsonResult(new
                    {
                        success = false,
                        errorMessage = "Invalid SubjectId or StudyId",
                        data = new List<object>()
                    });
                }

                var requestData = new
                {
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    SubjectId = request.SubjectId,
                    StudyId = request.StudyId
                };

                BaseResponse visitPlanResponse = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    "api/v1/SUB/getvisitplanlist",
                    "Visit Plan List",
                    "",
                    requestData
                );

                if (visitPlanResponse == null || visitPlanResponse.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        errorMessage = "Error reading Visit Plan data",
                        data = new List<object>()
                    });
                }


                if (visitPlanResponse.Success && visitPlanResponse.Data != null)
                {
                    List<SubjectVisitList> result = JsonConvert.DeserializeObject<List<SubjectVisitList>>(visitPlanResponse.Data.ToString());

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
                        errorMessage = visitPlanResponse.Message,
                        success = false,
                        data = new List<SubjectVisitList>()
                    });
                }                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetVisitPlanDataAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    errorMessage = ex.Message,
                    data = new List<object>()
                });
            }
        }
    }

    public class VisitPlanRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public int SubjectId { get; set; }
        public int StudyId { get; set; }
    }
}
