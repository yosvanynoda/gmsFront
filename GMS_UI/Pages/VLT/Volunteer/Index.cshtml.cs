using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

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

        public async Task<JsonResult> OnPostAsync()
        {
            try
            {

                var requestData = new GeneralCompanySiteRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    SiteId = 1, // Assuming SiteId is always 1
                };

                BaseResponse volunteers = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetVolunteerList(), "a Volunteer List", "", requestData);

                if (volunteers == null || volunteers.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Volunteer List",
                        success = false,
                        data = new List<VLTVolunteerList>()
                    });
                }

                if (volunteers.Success && volunteers.Data != null)
                {
                    List<VLTVolunteerList> result = JsonConvert.DeserializeObject<List<VLTVolunteerList>>(volunteers.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Volunteer List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = volunteers.Message,
                        success = false,
                        data = new List<VLTVolunteerList>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<VLTVolunteerList>()
                });
            }

        }

        public async Task<JsonResult> OnPostGetHistoryAsync([FromBody] VolunteerRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetHistoryAsync called for VolunteerId: {VolunteerId}", request.VolunteerId);

                var requestData = new VolunteerRequest
                {
                    CompanyId = 1,
                    SiteId = 1,
                    VolunteerId = request.VolunteerId
                };

                BaseResponse historyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvolunteerhistory", "Volunteer History", "", requestData);

                if (historyResponse == null || historyResponse.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Error reading Volunteer History"
                    });
                }

                if (historyResponse.Success && historyResponse.Data != null)
                {
                    // Deserialize to the correct type
                    VLTVolunteerHistoryResponse historyData = null;

                    if (historyResponse.Data != null)
                    {
                        var dataType = historyResponse.Data.GetType();
                        _logger.LogInformation("History Data type: {Type}", dataType.FullName);

                        // If Data is a string (JSON), deserialize it
                        if (dataType == typeof(string))
                        {
                            historyData = JsonConvert.DeserializeObject<VLTVolunteerHistoryResponse>(historyResponse.Data.ToString());
                        }
                        // If Data is JArray or JToken, convert to typed object
                        else if (dataType.FullName.StartsWith("Newtonsoft.Json.Linq"))
                        {
                            historyData = JsonConvert.DeserializeObject<VLTVolunteerHistoryResponse>(historyResponse.Data.ToString());
                        }
                        // If it's already the correct type
                        else if (dataType == typeof(VLTVolunteerHistoryResponse))
                        {
                            historyData = (VLTVolunteerHistoryResponse)historyResponse.Data;
                        }
                    }

                    return new JsonResult(new
                    {
                        success = true,
                        message = historyResponse.Message,
                        data = historyData
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = historyResponse.Message ?? "Error reading Volunteer History"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetHistoryAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }

        public async Task<JsonResult> OnPostPreAssignAsync()
        {
            try
            {
                _logger.LogInformation("OnPostPreAssignAsync called");

                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                _logger.LogInformation("Request body: {Body}", body);

                var requestInput = JsonConvert.DeserializeObject<PreAssignRequestInput>(body);

                if (requestInput == null)
                {
                    _logger.LogWarning("Deserialized pre-assign request is null");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid request data"
                    });
                }

                if ( requestInput.StudyId <= 0)
                {
                    _logger.LogWarning("Invalid VolunteerId or StudyId - VolunteerId: {VolunteerId}, StudyId: {StudyId}",
                        requestInput.VolunteerId, requestInput.StudyId);
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid VolunteerId or StudyId"
                    });
                }

                // Build the request using the same structure as Filter view
                var preAssignRequest = new PreAssignVolunteersToStudyRequest
                {
                    CompanyId = requestInput.CompanyId > 0 ? requestInput.CompanyId : 1,
                    SiteId = requestInput.SiteId > 0 ? requestInput.SiteId : 1,
                    StudyId = requestInput.StudyId,
                    VolunteerIds = new List<int> { requestInput.VolunteerId },
                    Username = 1
                };

                _logger.LogInformation("Calling PreAssign API - StudyId: {StudyId}, VolunteerIds: {VolunteerId}",
                    preAssignRequest.StudyId, requestInput.VolunteerId);

                // Call the PreAssign API
                var result = await GenericAPI.CreateGeneric(
                    _settings.ApiUrl(),
                    "api/v1/STD/preassignvolunteerstostudy",
                    "Pre-Assign Volunteers",
                    "",
                    preAssignRequest
                );

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Volunteer pre-assigned to study successfully."
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Failed to pre-assign volunteer."
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostPreAssignAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }
    }

    public class PreAssignRequestInput
    {
        public int VolunteerId { get; set; }
        public int StudyId { get; set; }
        public int CompanyId { get; set; }
        public int SiteId { get; set; }

    }
}
