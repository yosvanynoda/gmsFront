using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using GMS_UI.Models.VLT;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class FilterModel : PageModel
    {
        private readonly ILogger<FilterModel> _logger;
        private readonly ISettings _settings;

        public FilterModel(ILogger<FilterModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public List<SelectListItem> GenderList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> RaceList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> EthnicityList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> LanguageList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> DiseaseList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> VLTStatusList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> StudyList { get; set; } = new List<SelectListItem>();

        public async Task OnGetAsync()
        {
            var requestData = new GeneralCompanySiteRequest
            {
                CompanyId = 1,
                SiteId = 1,
            };

            // Load Gender List
            var genderResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetGenderList(), "Gender List", "", requestData);
            if (genderResponse?.Success == true && genderResponse.Data != null)
            {
                var genderData = JsonConvert.DeserializeObject<List<GenderBaseResponse>>(genderResponse.Data.ToString());
                GenderList = genderData?.Select(g => new SelectListItem { Value = g.Id.ToString(), Text = g.Gender }).ToList() ?? new List<SelectListItem>();
            }

            // Load Race List
            var raceResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRaceList(), "Race List", "", requestData);
            if (raceResponse?.Success == true && raceResponse.Data != null)
            {
                var raceData = JsonConvert.DeserializeObject<List<RaceBaseResponse>>(raceResponse.Data.ToString());
                RaceList = raceData?.Select(r => new SelectListItem { Value = r.Id.ToString(), Text = r.Race }).ToList() ?? new List<SelectListItem>();
            }

            // Load Ethnicity List
            var ethnicityResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetEthnicityList(), "Ethnicity List", "", requestData);
            if (ethnicityResponse?.Success == true && ethnicityResponse.Data != null)
            {
                var ethnicityData = JsonConvert.DeserializeObject<List<EthnicityBaseResponse>>(ethnicityResponse.Data.ToString());
                EthnicityList = ethnicityData?.Select(e => new SelectListItem { Value = e.Id.ToString(), Text = e.Ethnicity }).ToList() ?? new List<SelectListItem>();
            }

            // Load Language List
            var languageResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetLanguageList(), "Language List", "", requestData);
            if (languageResponse?.Success == true && languageResponse.Data != null)
            {
                var languageData = JsonConvert.DeserializeObject<List<LanguageBaseResponse>>(languageResponse.Data.ToString());
                LanguageList = languageData?.Select(l => new SelectListItem { Value = l.Id.ToString(), Text = l.Language }).ToList() ?? new List<SelectListItem>();
            }

            // Load Disease List
            var diseaseResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDiseaseList(), "Disease List", "", requestData);
            if (diseaseResponse?.Success == true && diseaseResponse.Data != null)
            {
                var diseaseData = JsonConvert.DeserializeObject<List<DiseaseBaseResponse>>(diseaseResponse.Data.ToString());
                DiseaseList = diseaseData?.Select(d => new SelectListItem { Value = d.DiseaseId.ToString(), Text = d.DiseaseName }).ToList() ?? new List<SelectListItem>();
            }

            // Load VLT Status List
            var vltStatusResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvltstatusdroplist", "VLT Status List", "", requestData);
            if (vltStatusResponse?.Success == true && vltStatusResponse.Data != null)
            {
                var vltStatusData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(vltStatusResponse.Data.ToString());
                VLTStatusList = vltStatusData?.Select(v => new SelectListItem { Value = v.Id.ToString(), Text = v.Name }).ToList() ?? new List<SelectListItem>();
            }

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

        public async Task<JsonResult> OnPostSearchAsync(VolunteerSearchRequest searchRequest)
        {
            try
            {
                _logger.LogInformation("OnPostSearchAsync called");

                //using var reader = new StreamReader(Request.Body);
                //var body = await reader.ReadToEndAsync();

                //_logger.LogInformation("Request body: {Body}", body);

                //var searchRequest = JsonConvert.DeserializeObject<VolunteerSearchRequest>(body);

                if (searchRequest == null)
                {
                    _logger.LogWarning("Deserialized search request is null");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid request data"
                    });
                }

                var result = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/searchvolunteersforstudy", "Search Volunteers", "", searchRequest);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    // Deserialize the Data if it's a string
                    //object volunteers = result.Data;

                    if (result.Data != null)
                    {
                        //var dataType = result.Data.GetType();
                        //_logger.LogInformation("Result.Data type: {Type}", dataType.FullName);

                        //// If Data is a string (JSON), deserialize it
                        //if (dataType == typeof(string))
                        //{
                        //    volunteers = JsonConvert.DeserializeObject(result.Data.ToString());
                        //    _logger.LogInformation("Deserialized string data");
                        //}
                        //// If Data is JArray or JToken, convert to object
                        //else if (dataType.FullName.StartsWith("Newtonsoft.Json.Linq"))
                        //{
                        //    volunteers = JsonConvert.DeserializeObject(result.Data.ToString());
                        //    _logger.LogInformation("Converted JToken/JArray data");
                        //}

                        var volunteers = JsonConvert.DeserializeObject<List<VLTVolunteerSearchResult>>(result.Data.ToString());

                        return new JsonResult(new
                        {
                            success = true,
                            message = result.Message,
                            data = volunteers
                        });
                    }

                    
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Error searching volunteers"
                    });
                }

                return new JsonResult(new
                {
                    success = false,
                    message = result?.Message ?? "Error searching volunteers"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostSearchAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }

        public async Task<JsonResult> OnPostPreAssignAsync()
        {
            try
            {
                _logger.LogInformation("OnPostPreAssignAsync called");

                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                _logger.LogInformation("Request body: {Body}", body);

                var preAssignRequest = JsonConvert.DeserializeObject<PreAssignVolunteersToStudyRequest>(body);

                if (preAssignRequest == null)
                {
                    _logger.LogWarning("Deserialized pre-assign request is null");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid request data"
                    });
                }

                var result = await GenericAPI.CreateGeneric(_settings.ApiUrl(), "api/v1/STD/preassignvolunteerstostudy", "Pre-Assign Volunteers", "", preAssignRequest);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = result.Message,
                        data = result.Data
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = result?.Message ?? "Error pre-assigning volunteers"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostPreAssignAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }
    }
}
