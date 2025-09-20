using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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
    }
}
