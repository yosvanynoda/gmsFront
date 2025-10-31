using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.StudioDoc
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostOpenStudy()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse studioDocs = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetStudioDocList(), "a StudioDoc List", "", requestData);

                if (studioDocs == null || studioDocs.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading StudioDoc List",
                        success = false,
                        data = new List<StudioDocBaseResponse>()
                    });
                }

                if (studioDocs.Success && studioDocs.Data != null)
                {
                    List<StudioDocBaseResponse> result = JsonConvert.DeserializeObject<List<StudioDocBaseResponse>>(studioDocs.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "StudioDoc List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = studioDocs.Message,
                        success = false,
                        data = new List<StudioDocBaseResponse>()
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
                    data = new List<StudioDocBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudStudioDoc(int id, int studioId, string name, int typeId, DateTime docDate, string version, string notes, int siteId, int action)
        {
            try
            {
                var createRequest = new CreateStudioDocRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Id = id,
                    StudioId = studioId,
                    Name = name,
                    TypeId = typeId,
                    DocDate = docDate,
                    Version = version,
                    Notes = notes,
                    SiteId = siteId,
                    Username = 1, // Assuming a default user name for the system
                    Action = action
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateStudioDoc(), "a StudioDoc", "", createRequest);

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
