using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.PRJ;
using GMS.Objects.STD;
using GMS.Objects.SUB;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Numerics;

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

        public async Task<JsonResult> OnPostGetStaffListAsync([FromBody] GetStaffListRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetStaffListAsync called for StudioId: {StudioId}", request.StudioId);

                var requestData = new
                {
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    StaffId = (int?)null,
                    StudioId = request.StudioId
                };

                BaseResponse staffResponse = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    "api/v1/cmn/getstaffstudio",
                    "Staff List",
                    "",
                    requestData
                );

                if (staffResponse == null || staffResponse.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Error reading Staff data",
                        data = new List<object>()
                    });
                }

                if (staffResponse.Success && staffResponse.Data != null)
                {
                    // Serialize and deserialize to proper format
                    var jsonString = JsonConvert.SerializeObject(staffResponse.Data);
                    _logger.LogInformation("Staff response JSON: {Json}", jsonString);

                    var staffList = JsonConvert.DeserializeObject<List<StaffStudioDto>>(jsonString);

                    return new JsonResult(new
                    {
                        success = true,
                        message = "Staff list retrieved successfully",
                        data = staffList
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = staffResponse.Message,
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetStaffListAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                    data = new List<object>()
                });
            }
        }

        public async Task<JsonResult> OnPostCreateVisit(int staffId, string notes, int studioId, int subjectId,
            DateTime visitDate, int visitId)
        {
            try
            {
                var createRequest = new CreateVisitRequest
                {
                    Staffid = staffId,
                    Notes = notes,
                    StudioId = studioId,
                    SubjectId = subjectId,
                    VisitDate = visitDate,
                    VisitId = visitId,  
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateVisit(), "a Visit", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
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

    public class GetStaffListRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public int StudioId { get; set; }
    }

    public class StaffStudioDto
    {
        public int Id { get; set; }
        public int StudioId { get; set; }
        public int StaffId { get; set; }
        public int RoleId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int CompanyId { get; set; }
        public int UserName { get; set; }
        public DateTime ActionDateTime { get; set; }
        public bool Active { get; set; }
        public DateTime? LastUpdateAt { get; set; }
        public int SiteId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string RoleType { get; set; } = string.Empty;
    }
}
