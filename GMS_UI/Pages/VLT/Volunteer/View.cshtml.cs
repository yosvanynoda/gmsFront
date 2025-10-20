using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;


namespace GMS_UI.Pages.VLT.Volunteer
{
    public class ViewModel : PageModel
    {
        private readonly ILogger<ViewModel> _logger;
        private readonly ISettings _settings;

        public ViewModel(ILogger<ViewModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [BindProperty(SupportsGet = true)]
        public int VolunteerId { get; set; }

        [BindProperty(SupportsGet = true)]
        public string ReturnUrl { get; set; } = "/SUB/Subject/Index";

        public List<SelectListItem> FlagList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> RaceList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> EthnicityList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> GenderList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> LanguageList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> VLTStatusList { get; set; } = new List<SelectListItem>();

        public object? VolunteerData { get; set; }

        public async Task OnGetAsync()
        {
            var requestData = new GeneralCompanySiteRequest
            {
                CompanyId = 1,
                SiteId = 1,
            };

            // Load dropdown lists
            var flagResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/CMN/getflagdroplist", "Flag List", "", requestData);
            if (flagResponse?.Success == true && flagResponse.Data != null)
            {
                var flagData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(flagResponse.Data.ToString());
                FlagList = flagData?.Select(f => new SelectListItem { Value = f.Id.ToString(), Text = f.Name }).ToList() ?? new List<SelectListItem>();
            }

            var raceResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRaceList(), "Race List", "", requestData);
            if (raceResponse?.Success == true && raceResponse.Data != null)
            {
                var raceData = JsonConvert.DeserializeObject<List<RaceBaseResponse>>(raceResponse.Data.ToString());
                RaceList = raceData?.Select(r => new SelectListItem { Value = r.Id.ToString(), Text = r.Race }).ToList() ?? new List<SelectListItem>();
            }

            var ethnicityResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetEthnicityList(), "Ethnicity List", "", requestData);
            if (ethnicityResponse?.Success == true && ethnicityResponse.Data != null)
            {
                var ethnicityData = JsonConvert.DeserializeObject<List<EthnicityBaseResponse>>(ethnicityResponse.Data.ToString());
                EthnicityList = ethnicityData?.Select(e => new SelectListItem { Value = e.Id.ToString(), Text = e.Ethnicity }).ToList() ?? new List<SelectListItem>();
            }

            var genderResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetGenderList(), "Gender List", "", requestData);
            if (genderResponse?.Success == true && genderResponse.Data != null)
            {
                var genderData = JsonConvert.DeserializeObject<List<GenderBaseResponse>>(genderResponse.Data.ToString());
                GenderList = genderData?.Select(g => new SelectListItem { Value = g.Id.ToString(), Text = g.Gender }).ToList() ?? new List<SelectListItem>();
            }

            var languageResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetLanguageList(), "Language List", "", requestData);
            if (languageResponse?.Success == true && languageResponse.Data != null)
            {
                var languageData = JsonConvert.DeserializeObject<List<LanguageBaseResponse>>(languageResponse.Data.ToString());
                LanguageList = languageData?.Select(l => new SelectListItem { Value = l.Id.ToString(), Text = l.Language }).ToList() ?? new List<SelectListItem>();
            }

            // Load VLT Status List
            var vltStatusResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvltstatusdroplist", "VLT Status List", "", requestData);
            if (vltStatusResponse?.Success == true && vltStatusResponse.Data != null)
            {
                var vltStatusData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(vltStatusResponse.Data.ToString());
                VLTStatusList = vltStatusData?.Select(v => new SelectListItem { Value = v.Id.ToString(), Text = v.Name }).ToList() ?? new List<SelectListItem>();
            }

            // Load volunteer data
            var volunteerRequest = new VolunteerRequest
            {
                CompanyId = 1,
                SiteId = 1,
                VolunteerId = VolunteerId
            };

            _logger.LogInformation("Fetching volunteer data for VolunteerId: {VolunteerId}, ReturnUrl: {ReturnUrl}", VolunteerId, ReturnUrl);

            var volunteerResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetVolunteerData(), "Volunteer Data", "", volunteerRequest);

            _logger.LogInformation("Volunteer Response - Success: {Success}, Data: {Data}",
                volunteerResponse?.Success,
                volunteerResponse?.Data != null ? JsonConvert.SerializeObject(volunteerResponse.Data) : "null");

            if (volunteerResponse?.Success == true && volunteerResponse.Data != null)
            {
                // Serialize and deserialize to ensure we have a clean object
                var jsonString = JsonConvert.SerializeObject(volunteerResponse.Data);
                _logger.LogInformation("Volunteer data JSON: {Json}", jsonString);
                VolunteerData = JsonConvert.DeserializeObject<dynamic>(jsonString);
                _logger.LogInformation("Volunteer data assigned. Type: {Type}", VolunteerData?.GetType().Name);
            }
            else
            {
                _logger.LogWarning("Failed to load volunteer data: {Message}", volunteerResponse?.Message);
            }
        }
    }
}
