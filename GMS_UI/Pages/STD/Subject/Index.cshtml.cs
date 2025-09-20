using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.Subject
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

                BaseResponse subjects = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetSubjectList(), "a Subject List", "", requestData);

                if (subjects == null || subjects.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Subject List",
                        success = false,
                        data = new List<SubjectBaseResponse>()
                    });
                }

                if (subjects.Success && subjects.Data != null)
                {
                    List<SubjectBaseResponse> result = JsonConvert.DeserializeObject<List<SubjectBaseResponse>>(subjects.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Subject List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = subjects.Message,
                        success = false,
                        data = new List<SubjectBaseResponse>()
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
                    data = new List<SubjectBaseResponse>()
                });
            }

        }
    }
}
