using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using GMS_UI.Models.Enum;
using GMS_UI.Models.STD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.StudioListData
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostStudioList()
        {
            try
            {

                var requestData = new StudioRequest
                {
                    CompanyId = 1, // Replace with actual company ID
                    SiteId = 1 // Replace with actual site ID
                };

                BaseResponse<List<StudioListResponse>> studies = await GenericAPI.GetGeneric<List<StudioListResponse>>(_settings.ApiUrl(), _settings.Endpoint_GetStudioList(), "a StudioListData List", "", requestData);

                if (studies == null || studies.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Studio List",
                        success = false,
                        data = new List<StudioListResponse>()
                    });
                }

                if (studies.Success && studies.Data != null)
                {
                    // Data is already strongly-typed - no need to deserialize again
                    List<StudioListResponse> response = studies.Data;

                    // DEBUG: Log the first item to see if Team is populated
                    if (response.Count > 0)
                    {
                        _logger.LogInformation("First studio - Team value: '{Team}'", response[0].Team);
                    }

                    if (response == null)
                    {
                        return new JsonResult(new
                        {
                            errorCode = 500,
                            errorMessage = "Error deserializing Studio List data",
                            success = false,
                            data = new List<StudioListResponse>()
                        });
                    }

                    List<StudioListViewModel> result = [.. response.Select(st => new StudioListViewModel {
                        CompanyId = st.CompanyId,
                        Code = st.Code,
                        Description = st.Description,
                        EndDate = st.EndDate,
                        Goal = st.Goal,
                        Id = st.Id,
                        Indication = st.Indication,
                        LastUpdatedAt = st.LastUpdatedAt,
                        Name = st.Name,
                        Notes = st.Notes,
                        Phase = st.Phase,
                        ProtocolId = st.ProtocolId,
                        ProtocolName = st.ProtocolName,
                        RandomizationType = st.RandomizationType,
                        SiteId = st.SiteId,
                        SiteName = st.SiteName,
                        SponsorId = st.SponsorId,
                        ActionDateTime = st.ActionDateTime,
                        StartDate = st.StartDate,
                        StudioStatus = st.StudioStatus,
                        TherapeuticArea = st.TherapeuticArea,
                        UserName = st.UserName,
                        DateCreated = st.DateCreated,
                        Active = st.Active,
                        BlindType = st.BlindType,
                        SponsorName = st.SponsorName,
                        StudioStatusName = ((StudyStatusEnum)st.StudioStatus).ToString(),
                        Team = st.Team,
                    })];

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Studies List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = studies.Message,
                        success = false,
                        data = new List<StudioListResponse>()
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
                    data = new List<StudioListResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostStaffDropList(int companyId, int siteId)
        {
            try
            {
                var requestData = new StudioRequest
                {
                    CompanyId = companyId,
                    SiteId = siteId
                };

                _logger.LogInformation("OnPostStaffDropList called - CompanyId: {CompanyId}, SiteId: {SiteId}", companyId, siteId);

                BaseResponse<List<DropListBaseResponse>> staffList = await GenericAPI.GetGeneric<List<DropListBaseResponse>>(_settings.ApiUrl(), _settings.Endpoint_GetStaffDropList(), "Staff Drop List", "", requestData);

                _logger.LogInformation("API Response - Success: {Success}, Data is null: {DataIsNull}", staffList?.Success, staffList?.Data == null);

                if (staffList == null || staffList.Data == null)
                {
                    _logger.LogWarning("Staff list or data is null");
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = staffList?.Message ?? "Error reading Staff List",
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }

                if (staffList.Success && staffList.Data != null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Staff List was read successfully",
                        success = true,
                        data = staffList.Data
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = staffList.Message,
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostStaffDropList: {Message}", ex.Message);
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DropListBaseResponse>()
                });
            }
        }

        public async Task<JsonResult> OnPostGetAssignedStaff(int studyId)
        {
            try
            {
                BaseResponse assignedStaff = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetStaffStudio(), "Assigned Staff", "", new { CompanyId = 1, SiteId = 1, StaffId = (int?)null, StudioId = studyId });

                if (assignedStaff == null || assignedStaff.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Error reading assigned staff",
                        data = new List<object>()
                    });
                }

                if (assignedStaff.Success && assignedStaff.Data != null)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        data = assignedStaff.Data
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = assignedStaff.Message,
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                    data = new List<object>()
                });
            }
        }

        public async Task<JsonResult> OnPostAssignStaff(int studyId, int staffId)
        {
            try
            {
                var createRequest = new CreateStudioStaffRequest
                {
                    CompanyId = 1,
                    SiteId = 1,
                    StudioId = studyId,
                    StaffId = staffId,
                    RoleId = 0,
                    UserName = 1,
                    Action = 1
                };

                BaseResponse result = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateStudioStaff(), "Assign Staff", "", createRequest);

                if (result == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Error assigning staff to study"
                    });
                }

                return new JsonResult(new
                {
                    success = result.Success,
                    message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostAssignStaff: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }

    }
}
