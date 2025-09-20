using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

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
    }
}
