using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.Sponsor
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostSponsorList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };


                BaseResponse sponsors = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetSponsorList(), "a Sponsor List", "", requestData);

                if (sponsors == null || sponsors.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Sponsor List",
                        success = false,
                        data = new List<SponsorBaseResponse>()
                    });
                }

                if (sponsors.Success && sponsors.Data != null)
                {
                    List<SponsorBaseResponse> result = JsonConvert.DeserializeObject<List<SponsorBaseResponse>>(sponsors.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Sponsor List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = sponsors.Message,
                        success = false,
                        data = new List<SponsorBaseResponse>()
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
                    data = new List<SponsorBaseResponse>()
                });
            }

        }


        public async Task<JsonResult> OnPostCrudSponsor(int id, int action, string name, int sponsorType,
            string contactName, string contactEmail, string contactPhone)
        {
            try
            {
                var createRequest = new CreateSponsorRequest
                {
                    Id = id,
                    Action = action,
                    SponsorName = name,
                    SponsorType = sponsorType,
                    ContactName = contactName,
                    ContactEmail = contactEmail,
                    ContactPhone = contactPhone,
                    CompanyId = 1, // Assuming CompanyId is always 1
                    SiteId = 1, // Assuming SiteId is always 1
                    Username = 1, // Assuming a default user name for the system
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateSponsor(), "a Sponsor", "", createRequest);

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
