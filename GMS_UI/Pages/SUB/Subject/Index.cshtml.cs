using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.SUB;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.SUB.Subject
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly ISettings _settings;

        public IndexModel(ILogger<IndexModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public void OnGet()
        {
        }

        public async Task<JsonResult> OnPostAsync()
        {
            try
            {
                _logger.LogInformation("OnPostAsync called for Subject list");

                var requestData = new SubjectListRequest
                {
                    CompanyId = 1,
                    SiteId = 1
                };

                BaseResponse subjectList = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/SUB/getsubjectlist", "Subject List", "", requestData);

                if (subjectList == null || subjectList.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Subject List",
                        success = false,
                        data = new List<SubjectList>()
                    });
                }

                if (subjectList.Success && subjectList.Data != null)
                {
                    List<SubjectList> result = JsonConvert.DeserializeObject<List<SubjectList>>(subjectList.Data.ToString());

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
                        errorMessage = subjectList.Message,
                        success = false,
                        data = new List<SubjectList>()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<SubjectList>()
                });
            }
        }
    }

    public class SubjectListRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
    }
}
