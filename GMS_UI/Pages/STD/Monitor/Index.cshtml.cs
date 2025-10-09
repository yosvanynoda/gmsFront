using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.Monitor
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostMonitorList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse monitors = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetMonitorList(), "a Monitor List", "", requestData);

                if (monitors == null || monitors.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Monitor List",
                        success = false,
                        data = new List<MonitorBaseResponse>()
                    });
                }

                if (monitors.Success && monitors.Data != null)
                {
                    List<MonitorBaseResponse> result = JsonConvert.DeserializeObject<List<MonitorBaseResponse>>(monitors.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Monitor List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = monitors.Message,
                        success = false,
                        data = new List<MonitorBaseResponse>()
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
                    data = new List<MonitorBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudMonitor(int id, string firstName, string lastName, string email, string phone, 
            string role, int sponsorId, int action)
        {
            try
            {
                var createRequest = new CreateMonitorRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Id = id,
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Phone = phone,
                    Role = role,
                    SponsorId = sponsorId,
                    SiteId = 1, // Assuming a default site Id for the system
                    Username = 1, // Assuming a default user name for the system
                    Action = action
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateMonitor(), "a Monitor", "", createRequest);

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

        public async Task<JsonResult> OnPostMonitorDropList(int sponsorId)
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse monitors = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetMonitorDropList(), "a Monitor List", "", requestData);

                if (monitors == null || monitors.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Monitor List",
                        success = false,
                        data = new List<MonitorBaseResponse>()
                    });
                }

                if (monitors.Success && monitors.Data != null)
                {
                    List<MonitorBaseResponse> result = JsonConvert.DeserializeObject<List<MonitorBaseResponse>>(monitors.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Monitor List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = monitors.Message,
                        success = false,
                        data = new List<MonitorBaseResponse>()
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
                    data = new List<MonitorBaseResponse>()
                });
            }

        }
    }
}
