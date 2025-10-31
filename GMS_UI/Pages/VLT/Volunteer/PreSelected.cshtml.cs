using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS.Objects.SUB;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class PreSelectedModel : PageModel
    {
        private readonly ILogger<PreSelectedModel> _logger;
        private readonly ISettings _settings;

        public PreSelectedModel(ILogger<PreSelectedModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public List<SelectListItem> StudyList { get; set; } = new List<SelectListItem>();

        public async Task OnGetAsync()
        {
            // Load Study List
            var studyRequest = new StudioRequest
            {
                CompanyId = 1,
                SiteId = 1
            };
            var studyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/STD/getstudiodroplist", "Study List", "", studyRequest);
            if (studyResponse?.Success == true && studyResponse.Data != null)
            {
                var studyData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(studyResponse.Data.ToString());
                StudyList = studyData?.Select(s => new SelectListItem { Value = s.Id.ToString(), Text = s.Name }).ToList() ?? new List<SelectListItem>();
            }
        }

        public async Task<JsonResult> OnPostGetPreSelectedVolunteers(int? studyId) //PreSelectedRequest request
        {
            try
            {
                _logger.LogInformation("OnPostAsync called for PreSelected volunteers");

                if (studyId == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "No study selected",
                        success = false,
                        data = new List<VLTVolunteerPreSelectedList>()
                    });
                }

                var requestData = new PreSelectedRequest
                {
                    CompanyId = 1,
                    SiteId = 1,
                    StudyId = (int)studyId
                };

                BaseResponse preSelectedVolunteers = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvolunteerpreselectedlist", "Pre-Selected Volunteers List", "", requestData);

                if (preSelectedVolunteers == null || preSelectedVolunteers.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Pre-Selected Volunteers List",
                        success = false,
                        data = new List<VLTVolunteerPreSelectedList>()
                    });
                }

                if (preSelectedVolunteers.Success && preSelectedVolunteers.Data != null)
                {
                    List<VLTVolunteerPreSelectedList> result = JsonConvert.DeserializeObject<List<VLTVolunteerPreSelectedList>>(preSelectedVolunteers.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Pre-Selected Volunteers List was read successfully",
                        success = true,
                        data = result
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = preSelectedVolunteers.Message,
                        success = false,
                        data = new List<VLTVolunteerPreSelectedList>()
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
                    data = new List<VLTVolunteerPreSelectedList>()
                });
            }
        }

        public async Task<JsonResult> OnPostCreateSubjectAsync([FromBody] CreateSubjectFromPreSelectedRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostCreateSubjectAsync called for VolunteerId: {VolunteerId}, StudyId: {StudyId}, SubjectCode: {SubjectCode}",
                    request.VolunteerId, request.StudyId, request.SubjectCode);

                // Validate subject code
                if (string.IsNullOrWhiteSpace(request.SubjectCode))
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Subject code is required."
                    });
                }

                // Build the CreateSubject request
                var createSubjectRequest = new CreateSubjectRequest
                {
                    SubjectData = new List<SubjectData>
                    {
                        new SubjectData
                        {
                            SubjectId = 0,  // New subject
                            VolunteerId = request.VolunteerId,
                            StudyId = request.StudyId,
                            CompanyId = 1,
                            SiteId = 1,
                            UserNameId = 1,
                            CurrentStatus = "Active",
                            CurrentStatusId = 0
                        }
                    }
                };

                // Call the CreateSubject API with subjectCode as query parameter
                var endpoint = $"api/v1/SUB/createsubject?subjectCode={Uri.EscapeDataString(request.SubjectCode)}";

                var result = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    endpoint,
                    "Create Subject",
                    "",
                    createSubjectRequest
                );

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = $"Subject created successfully with code: {request.SubjectCode}"
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Failed to create subject."
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostCreateSubjectAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }

        public async Task<JsonResult> OnPostRemovePreAssignedAsync()
        {
            try
            {
                _logger.LogInformation("OnPostRemovePreAssignedAsync called");

                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                _logger.LogInformation("Request body: {Body}", body);

                var requestInput = JsonConvert.DeserializeObject<RemovePreAssignedRequestInput>(body);

                if (requestInput == null)
                {
                    _logger.LogWarning("Deserialized remove request is null");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid request data"
                    });
                }

                _logger.LogInformation("Parsed request - VolunteerId: {VolunteerId}, StudyId: {StudyId}, CompanyId: {CompanyId}, SiteId: {SiteId}",
                    requestInput.VolunteerId, requestInput.StudyId, requestInput.CompanyId, requestInput.SiteId);

                if (requestInput.VolunteerId <= 0)
                {
                    _logger.LogWarning("VolunteerId is invalid: {VolunteerId}", requestInput.VolunteerId);
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid VolunteerId"
                    });
                }

                if (requestInput.StudyId <= 0)
                {
                    _logger.LogWarning("StudyId is invalid: {StudyId}", requestInput.StudyId);
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid StudyId"
                    });
                }

                // Build the request with single VolunteerId (API was modified to accept int instead of list)
                var removeRequest = new RemovePreAssignedRequest
                {
                    CompanyId = requestInput.CompanyId > 0 ? requestInput.CompanyId : 1,
                    SiteId = requestInput.SiteId > 0 ? requestInput.SiteId : 1,
                    StudyId = requestInput.StudyId,
                    VolunteerId = requestInput.VolunteerId,
                    UserId = 1
                };

                _logger.LogInformation("Built RemovePreAssignedRequest - CompanyId: {CompanyId}, SiteId: {SiteId}, StudyId: {StudyId}, VolunteerId: {VolunteerId}, UserId: {UserId}",
                    removeRequest.CompanyId, removeRequest.SiteId, removeRequest.StudyId, removeRequest.VolunteerId, removeRequest.UserId);

                // Serialize to see what's being sent
                var requestJson = JsonConvert.SerializeObject(removeRequest);
                _logger.LogInformation("Request JSON: {RequestJson}", requestJson);

                // Call the RemovePreAssigned API
                var result = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    "api/v1/STD/removepreassigned",
                    "Remove Pre-Assigned",
                    "",
                    removeRequest
                );

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Pre-assignment removed successfully."
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Failed to remove pre-assignment."
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostRemovePreAssignedAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }
    }

    public class PreSelectedRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public int? StudyId { get; set; }
    }

    public class CreateSubjectFromPreSelectedRequest
    {
        public int VolunteerId { get; set; }
        public int StudyId { get; set; }
        public string SubjectCode { get; set; } = string.Empty;
    }

    public class RemovePreAssignedRequestInput
    {
        public int VolunteerId { get; set; }
        public int StudyId { get; set; }
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
    }

    public class RemovePreAssignedRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public int StudyId { get; set; }
        public int VolunteerId { get; set; }
        public int UserId { get; set; }
    }
}
