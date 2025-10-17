using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class PreSelectedModel : PageModel
    {
        private readonly ILogger<PreSelectedModel> _logger;
        private readonly ISettings _settings;

        public PreSelectedModel(ILogger<PreSelectedModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public List<SelectListItem> StudyList { get; set; } = new List<SelectListItem>();

        public async Task OnGetAsync()
        {
            // Load Study List
            var studyRequest = new StudioRequest
            {
                CompanyId = 1,
                SiteId = 1
            };
            var studyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/STD/getstudiodroplist", "Study List", "", studyRequest);
            if (studyResponse?.Success == true && studyResponse.Data != null)
            {
                var studyData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(studyResponse.Data.ToString());
                StudyList = studyData?.Select(s => new SelectListItem { Value = s.Id.ToString(), Text = s.Name }).ToList() ?? new List<SelectListItem>();
            }
        }

        public async Task<JsonResult> OnPostAsync([FromBody] PreSelectedRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostAsync called for PreSelected volunteers");

                var requestData = new PreSelectedRequest
                {
                    CompanyId = 1,
                    SiteId = 1,
                    StudyId = request.StudyId
                };

                BaseResponse preSelectedVolunteers = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvolunteerpreselectedlist", "Pre-Selected Volunteers List", "", requestData);

                if (preSelectedVolunteers == null || preSelectedVolunteers.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Pre-Selected Volunteers List",
                        success = false,
                        data = new List<VLTVolunteerPreSelectedList>()
                    });
                }

                if (preSelectedVolunteers.Success && preSelectedVolunteers.Data != null)
                {
                    List<VLTVolunteerPreSelectedList> result = JsonConvert.DeserializeObject<List<VLTVolunteerPreSelectedList>>(preSelectedVolunteers.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Pre-Selected Volunteers List was read successfully",
                        success = true,
                        data = result
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = preSelectedVolunteers.Message,
                        success = false,
                        data = new List<VLTVolunteerPreSelectedList>()
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
                    data = new List<VLTVolunteerPreSelectedList>()
                });
            }
        }
    }

    public class PreSelectedRequest
    {
        public int CompanyId { get; set; }
        public int SiteId { get; set; }
        public int? StudyId { get; set; }
    }
}
