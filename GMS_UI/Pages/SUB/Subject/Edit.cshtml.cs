using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.SUB;
using GMS_UI.Helper;
using GMS_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.SUB.Subject
{
    public class EditModel : PageModel
    {
        private readonly ILogger<EditModel> _logger;
        private readonly ISettings _settings;

        public EditModel(ILogger<EditModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [BindProperty(SupportsGet = true)]
        public int SubjectId { get; set; }

        [BindProperty(SupportsGet = true)]
        public string ReturnUrl { get; set; } = "/SUB/Subject/Index";

        public List<SelectListItem> ProtocolVersionList { get; set; } = new();
        public List<SelectListItem> DeviationList { get; set; } = new();

        public async Task OnGetAsync()
        {
            // Load Protocol Versions
            await LoadProtocolVersions();

            // Load Deviation Types
            await LoadDeviations();
        }

        private async Task LoadProtocolVersions()
        {
            try
            {
                // Get StudyId from subject data first - for now using a placeholder
                // You'll need to determine the studyId from the subject header
                var requestData = new
                {
                    CompanyId = 1,
                    ProtocolId = 0 // Will be determined from subject data
                };

                var response = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    _settings.Endpoint_GetProtocolVersionList(),
                    "Protocol Version List",
                    "",
                    requestData
                );

                if (response?.Success == true && response.Data != null)
                {
                    var protocolVersions = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(response.Data.ToString());

                    if (protocolVersions != null)
                    {
                        ProtocolVersionList = protocolVersions
                            .Select(pv => new SelectListItem
                            {
                                Value = pv.Id.ToString(),
                                Text = pv.Name
                            })
                            .ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading protocol versions");
                ProtocolVersionList = new List<SelectListItem>();
            }
        }

        private async Task LoadDeviations()
        {
            try
            {
                var requestData = new GeneralRequest
                {
                    CompanyId = 1
                };

                var response = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    _settings.Endpoint_GetDeviationDropList(),
                    "Deviation List",
                    "",
                    requestData
                );

                if (response?.Success == true && response.Data != null)
                {
                    var deviations = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(response.Data.ToString());

                    if (deviations != null)
                    {
                        DeviationList = deviations
                            .Select(d => new SelectListItem
                            {
                                Value = d.Id.ToString(),
                                Text = d.Name
                            })
                            .ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading deviations");
                DeviationList = new List<SelectListItem>();
            }
        }

        public async Task<JsonResult> OnPostGetSubjectDataAsync([FromBody] SubjectRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetSubjectDataAsync called for SubjectId: {SubjectId}", request.SubjectId);

                var requestData = new
                {
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    SubjectId = request.SubjectId
                };

                BaseResponse subjectData = await GenericAPI.GetGeneric(
                    _settings.ApiUrl(),
                    _settings.Endpoint_GetSubjectData(),
                    "Subject Data",
                    "",
                    requestData
                );

                if (subjectData == null || subjectData.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Subject Data",
                        success = false,
                        data = (object)null
                    });
                }

                if (subjectData.Success && subjectData.Data != null)
                {
                    // Deserialize the Data property as SubjectDataResponse with proper typing
                    var responseData = JsonConvert.DeserializeObject<SubjectDataResponse>(subjectData.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Subject Data was read successfully",
                        success = true,
                        data = responseData
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = subjectData.Message,
                        success = false,
                        data = (object)null
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetSubjectDataAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = (object)null
                });
            }
        }
    }
}
