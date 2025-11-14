using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.CMN.Staff
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostStaffList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse staffs = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetStaffList(), "a Staff List", "", requestData);

                if (staffs == null || staffs.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Staff List",
                        success = false,
                        data = new List<StaffBaseResponse>()
                    });
                }

                if (staffs.Success && staffs.Data != null)
                {
                    List<StaffBaseResponse> result = JsonConvert.DeserializeObject<List<StaffBaseResponse>>(staffs.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Staff List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = staffs.Message,
                        success = false,
                        data = new List<StaffBaseResponse>()
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
                    data = new List<StaffBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudStaff(string firstName, string lastName, string? email, string? phone, string? position,
            string? department, string? status, int action, int id)
        {
            try
            {
                var createRequest = new CreateStaffRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Username = 1, // Assuming a default user name for the system
                    Site = 1, //Assuming a default Site
                    Action = action,
                    StaffId = id,
                    Department = department,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Phone = phone,
                    Role = position,
                    Status = status,
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateStaff(), "a Staff", "", createRequest);

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

        public async Task<JsonResult> OnPostStudioDropList(int companyId, int siteId)
        {
            try
            {
                _logger.LogInformation("OnPostStudioDropList - CompanyId: {CompanyId}, SiteId: {SiteId}", companyId, siteId);

                var requestData = new
                {
                    CompanyId = companyId,
                    SiteId = siteId
                };

                var response = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/std/getstudiodroplist", "Studio Drop List", "", requestData);

                _logger.LogInformation("API Response - IsNull: {IsNull}, Success: {Success}, DataIsNull: {DataIsNull}, Message: {Message}",
                    response == null, response?.Success, response?.Data == null, response?.Message);

                if (response == null || response.Data == null)
                {
                    _logger.LogWarning("Response or Data is null");
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Studio List",
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }

                if (response.Success && response.Data != null)
                {
                    _logger.LogInformation("Deserializing data: {Data}", response.Data.ToString());
                    List<DropListBaseResponse> result = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(response.Data.ToString());
                    _logger.LogInformation("Deserialized {Count} studios", result?.Count ?? 0);
                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Studio List was read successfully",
                        success = true,
                        data = result
                    });
                }
                else
                {
                    _logger.LogWarning("Success is false, Message: {Message}", response.Message);
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = response.Message,
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostStudioDropList: {Message}", ex.Message);
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DropListBaseResponse>()
                });
            }
        }

        public async Task<JsonResult> OnPostRoleTypeList(int companyId)
        {
            try
            {
                var requestData = new GeneralRequest
                {
                    CompanyId = companyId
                };

                var response = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRoleTypeList(), "Role Type List", "", requestData);

                if (response?.Success == true && response.Data != null)
                {
                    var roleTypes = JsonConvert.DeserializeObject<List<RoleTypeBaseResponse>>(response.Data.ToString());
                    var dropdownData = roleTypes?.Select(r => new { value = r.Id, text = r.RoleType }).ToList();

                    return new JsonResult(new
                    {
                        success = true,
                        data = dropdownData
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = response?.Message ?? "Failed to load role types"
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        public async Task<JsonResult> OnPostStaffStudioAssignments(int staffId)
        {
            try
            {
                _logger.LogInformation("OnPostStaffStudioAssignments - StaffId: {StaffId}", staffId);

                var requestData = new
                {
                    CompanyId = 1,
                    SiteId = 1,
                    StaffId = (int?)staffId,
                    StudioId = (int?)null
                };

                var response = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetStaffStudio(), "Staff Studios", "", requestData);

                _logger.LogInformation("API Response - Success: {Success}, DataIsNull: {DataIsNull}, Message: {Message}",
                    response?.Success, response?.Data == null, response?.Message);

                if (response?.Success == true && response.Data != null)
                {
                    _logger.LogInformation("Raw Data: {Data}", response.Data.ToString());

                    var staffStudios = JsonConvert.DeserializeObject<List<dynamic>>(response.Data.ToString());
                    _logger.LogInformation("Deserialized {Count} assignments", staffStudios?.Count ?? 0);

                    // Transform the data to match JavaScript expectations
                    var transformedData = staffStudios?.Select(item => new
                    {
                        studioId = (int)item.studioId,
                        studioName = (string)item.name,
                        staffId = (int)item.staffId,
                        roleId = (int)item.roleId,
                        roleName = (string)item.roleType,
                        startDate = item.startDate,
                        endDate = item.endDate
                    }).ToList();

                    _logger.LogInformation("Returning {Count} transformed assignments", transformedData?.Count ?? 0);

                    return new JsonResult(new
                    {
                        success = true,
                        data = transformedData
                    });
                }
                else
                {
                    _logger.LogWarning("No data or Success=false, returning empty list");
                    return new JsonResult(new
                    {
                        success = true,
                        data = new List<object>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostStaffStudioAssignments: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        public async Task<JsonResult> OnPostSaveStudioStaffAssignment(int studioId, int staffId, int roleId,
            DateTime? startDate, DateTime? endDate, int companyId, int siteId, int userName, int action)
        {
            try
            {
                var requestData = new CreateStudioStaffRequest
                {
                    StudioId = studioId,
                    StaffId = staffId,
                    RoleId = roleId,
                    StartDate = startDate,
                    EndDate = endDate,
                    CompanyId = companyId,
                    SiteId = siteId,
                    UserName = userName,
                    Action = action
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateStudioStaff(), "Studio Staff Assignment", "", requestData);

                return new JsonResult(new
                {
                    success = response?.Success ?? false,
                    message = response?.Message ?? "Failed to save studio staff assignment"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
