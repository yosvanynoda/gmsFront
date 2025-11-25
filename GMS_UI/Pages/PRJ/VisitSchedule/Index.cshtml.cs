using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.CMN;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
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

        public List<SelectListItem> TeamList { get; set; } = new List<SelectListItem>();

        public async Task OnGetAsync()
        {
            _logger.LogInformation("VisitSchedule OnGet");

            // Load Team List
            var teamRequest = new GeneralSiteRequest
            {
                CompanyId = 1,
                SiteId = 1
            };
            var teamResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/CMN/getteamdroplist", "Team List", "", teamRequest);
            if (teamResponse?.Success == true && teamResponse.Data != null)
            {
                var teamData = JsonConvert.DeserializeObject<List<TeamDropListResponse>>(teamResponse.Data.ToString());
                TeamList = teamData?.Select(t => new SelectListItem { Value = t.Team, Text = t.Team }).ToList() ?? new List<SelectListItem>();
            }
        }

        public async Task<JsonResult> OnPostGetVisitScheduleAsync([FromBody] VisitScheduleRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetVisitScheduleAsync called for Date Range: {StartDate} to {EndDate}",
                    request.StartDate, request.EndDate);

                var requestData = new
                {
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate
                };

                BaseResponse visitScheduleResponse = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    "api/v1/PRJ/getvisitschedule",
                    "Visit Schedule",
                    "",
                    requestData
                );

                if (visitScheduleResponse == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        errorMessage = "Error connecting to the API",
                        data = new List<VisitScheduleDto>()
                    });
                }

                // Check for "No data found" - this is not an error, just no visits scheduled
                if (visitScheduleResponse.Message != null &&
                    visitScheduleResponse.Message.Contains("No data found", StringComparison.OrdinalIgnoreCase))
                {
                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "No visits scheduled for the selected date",
                        success = true,
                        data = new List<VisitScheduleDto>()
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
                        data = result ?? new List<VisitScheduleDto>()
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = visitScheduleResponse.Message ?? "Error loading visit schedule",
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

        public async Task<JsonResult> OnPostCompleteVisitAsync([FromBody] CreateCheckInRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostCompleteVisitAsync called for VisitId: {VisitId}, SubjectId: {SubjectId}",
                    request.VisitId, request.SubjectId);

                var requestData = new
                {
                    VisitId = request.VisitId,
                    SubjectId = request.SubjectId,
                    StudioId = request.StudioId
                };

                BaseResponse completeVisitResponse = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    "api/v1/PRJ/createsubjectvisitcompleted",
                    "Complete Visit",
                    "",
                    requestData
                );

                return new JsonResult(new
                {
                    success = completeVisitResponse.Success,
                    message = completeVisitResponse.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostCompleteVisitAsync: {Message}", ex.Message);
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
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
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
        public string Comment { get; set; } = string.Empty;
        public int VisitType { get; set; }
        public DateTime CheckingDate { get; set; }
        public string Team { get; set; } = string.Empty;
    }

    public class CreateCheckInRequest
    {
        public int VisitId { get; set; }
        public int SubjectId { get; set; }
        public int StudioId { get; set; }
    }

    public class TeamDropListResponse
    {
        public string Team { get; set; } = string.Empty;
    }
}
