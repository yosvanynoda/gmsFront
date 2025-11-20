using GMS.BL.Generic;
using GMS.Objects.API;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.PRJ.VisitSchedule
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
            _logger.LogInformation("VisitSchedule OnGet");
        }

        public async Task<JsonResult> OnPostGetVisitScheduleAsync([FromBody] VisitScheduleRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetVisitScheduleAsync called for Date: {ScheduleDate}", request.ScheduleDate);

                var requestData = new
                {
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    ScheduleDate = request.ScheduleDate
                };

                BaseResponse visitScheduleResponse = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    "api/v1/PRJ/getvisitschedule",
                    "Visit Schedule",
                    "",
                    requestData
                );

                if (visitScheduleResponse == null || visitScheduleResponse.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        errorMessage = "Error reading Visit Schedule data",
                        data = new List<object>()
                    });
                }

                if (visitScheduleResponse.Success && visitScheduleResponse.Data != null)
                {
                    var result = JsonConvert.DeserializeObject<List<VisitScheduleDto>>(visitScheduleResponse.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Visit Schedule was read successfully",
                        success = true,
                        data = result
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = visitScheduleResponse.Message,
                        success = false,
                        data = new List<VisitScheduleDto>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetVisitScheduleAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    errorMessage = ex.Message,
                    data = new List<object>()
                });
            }
        }

        public async Task<JsonResult> OnPostCreateCheckInAsync([FromBody] CreateCheckInRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostCreateCheckInAsync called for VisitId: {VisitId}, SubjectId: {SubjectId}",
                    request.VisitId, request.SubjectId);

                var requestData = new
                {
                    VisitId = request.VisitId,
                    SubjectId = request.SubjectId,
                    StudioId = request.StudioId
                };

                BaseResponse checkInResponse = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    "api/v1/PRJ/createsubjectchecking",
                    "Subject Check-in",
                    "",
                    requestData
                );

                return new JsonResult(new
                {
                    success = checkInResponse.Success,
                    message = checkInResponse.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostCreateCheckInAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }

    public class VisitScheduleRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public DateTime ScheduleDate { get; set; }
    }

    public class VisitScheduleDto
    {
        public int SubjectVisitID { get; set; }
        public int SubjectID { get; set; }
        public int VisitID { get; set; }
        public DateTime ScheduledDate { get; set; }
        public int StudyId { get; set; }
        public int StaffId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string StudyName { get; set; } = string.Empty;
        public string StaffName { get; set; } = string.Empty;
        public string VisitStatus { get; set; } = string.Empty;
    }

    public class CreateCheckInRequest
    {
        public int VisitId { get; set; }
        public int SubjectId { get; set; }
        public int StudioId { get; set; }
    }
}
