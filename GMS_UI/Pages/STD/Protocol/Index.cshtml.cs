using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.Protocol
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostAsync()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse protocols = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetProtocolList(), "a Protocol List", "", requestData);

                if (protocols == null || protocols.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Protocol List",
                        success = false,
                        data = new List<ProtocolBaseResponse>()
                    });
                }

                if (protocols.Success && protocols.Data != null)
                {
                    List<ProtocolBaseResponse> result = JsonConvert.DeserializeObject<List<ProtocolBaseResponse>>(protocols.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Protocol List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = protocols.Message,
                        success = false,
                        data = new List<ProtocolBaseResponse>()
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
                    data = new List<ProtocolBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudProtocol(int id, string protocol, DateTime datecreated, string version, int? siteid, string notes, int action, DateTime startDate, DateTime endDate)
        {
            try
            {
                var createRequest = new CreateProtocolRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Protocol = protocol,
                    Version = version,
                    Notes = notes,
                    DateCreated = datecreated,
                    SiteId = siteid,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    StartDate = startDate,
                    EndDate = endDate,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateProtocol(), "a Protocol", "", createRequest);

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
