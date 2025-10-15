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
    public class CreateModel : PageModel
    {
        private readonly ILogger<CreateModel> _logger;
        private readonly ISettings _settings;

        public CreateModel(ILogger<CreateModel> logger, ISettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [BindProperty]
        public CreateVolunteerDataRequest VolunteerData { get; set; } = new CreateVolunteerDataRequest();

        public List<SelectListItem> FlagList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> RaceList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> EthnicityList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> GenderList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> LanguageList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> AllergyList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> DiseaseList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> MedicationList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> VLTStatusList { get; set; } = new List<SelectListItem>();

        public async Task OnGetAsync()
        {
            var requestData = new GeneralCompanySiteRequest
            {
                CompanyId = 1,
                SiteId = 1,
            };

            // Load Flag List
            var flagResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/CMN/getflagdroplist", "Flag List", "", requestData);
            if (flagResponse?.Success == true && flagResponse.Data != null)
            {
                var flagData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(flagResponse.Data.ToString());
                FlagList = flagData?.Select(f => new SelectListItem { Value = f.Id.ToString(), Text = f.Name }).ToList() ?? new List<SelectListItem>();
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

            // Load Gender List
            var genderResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetGenderList(), "Gender List", "", requestData);
            if (genderResponse?.Success == true && genderResponse.Data != null)
            {
                var genderData = JsonConvert.DeserializeObject<List<GenderBaseResponse>>(genderResponse.Data.ToString());
                GenderList = genderData?.Select(g => new SelectListItem { Value = g.Id.ToString(), Text = g.Gender }).ToList() ?? new List<SelectListItem>();
            }

            // Load Language List
            var languageResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetLanguageList(), "Language List", "", requestData);
            if (languageResponse?.Success == true && languageResponse.Data != null)
            {
                var languageData = JsonConvert.DeserializeObject<List<LanguageBaseResponse>>(languageResponse.Data.ToString());
                LanguageList = languageData?.Select(l => new SelectListItem { Value = l.Id.ToString(), Text = l.Language }).ToList() ?? new List<SelectListItem>();
            }

            // Load Allergy List
            var allergyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetAllergyList(), "Allergy List", "", requestData);
            if (allergyResponse?.Success == true && allergyResponse.Data != null)
            {
                var allergyData = JsonConvert.DeserializeObject<List<AllergyBaseResponse>>(allergyResponse.Data.ToString());
                AllergyList = allergyData?.Select(a => new SelectListItem { Value = a.Id.ToString(), Text = a.Allergy }).ToList() ?? new List<SelectListItem>();
            }

            // Load Disease List
            var diseaseResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDiseaseList(), "Disease List", "", requestData);
            if (diseaseResponse?.Success == true && diseaseResponse.Data != null)
            {
                var diseaseData = JsonConvert.DeserializeObject<List<DiseaseBaseResponse>>(diseaseResponse.Data.ToString());
                DiseaseList = diseaseData?.Select(d => new SelectListItem { Value = d.DiseaseId.ToString(), Text = d.DiseaseName }).ToList() ?? new List<SelectListItem>();
            }

            // Load Medication List
            var medicationResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetMedicationList(), "Medication List", "", requestData);
            if (medicationResponse?.Success == true && medicationResponse.Data != null)
            {
                var medicationData = JsonConvert.DeserializeObject<List<MedicationBaseResponse>>(medicationResponse.Data.ToString());
                MedicationList = medicationData?.Select(m => new SelectListItem { Value = m.MedicationId.ToString(), Text = m.MedicationName }).ToList() ?? new List<SelectListItem>();
            }

            // Load VLT Status List
            var vltStatusResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvltstatusdroplist", "VLT Status List", "", requestData);
            if (vltStatusResponse?.Success == true && vltStatusResponse.Data != null)
            {
                var vltStatusData = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(vltStatusResponse.Data.ToString());
                VLTStatusList = vltStatusData?.Select(v => new SelectListItem { Value = v.Id.ToString(), Text = v.Name }).ToList() ?? new List<SelectListItem>();
            }
        }

        public async Task<JsonResult> OnPostCreateAsync()
        {
            try
            {
                _logger.LogInformation("OnPostCreateAsync called");

                // Read JSON from request body
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                _logger.LogInformation("Request body: {Body}", body);

                var volunteerData = JsonConvert.DeserializeObject<CreateVolunteerDataRequest>(body);

                if (volunteerData == null)
                {
                    _logger.LogWarning("Deserialized volunteer data is null");
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid request data - deserialization returned null"
                    });
                }

                _logger.LogInformation("Calling API - URL: {ApiUrl}, Endpoint: {Endpoint}",
                    _settings.ApiUrl(), _settings.Endpoint_CreateVolunteer());

                var result = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateVolunteer(), "Create Volunteer", "", volunteerData);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Volunteer created successfully",
                        data = result.Data
                    });
                }
                else
                {
                    var errorMessage = result?.Message ?? "Error creating volunteer - no message from API";
                    _logger.LogWarning("API returned error: {ErrorMessage}", errorMessage);
                    return new JsonResult(new
                    {
                        success = false,
                        message = errorMessage
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostCreateAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message} | Stack: {ex.StackTrace}"
                });
            }
        }
    }
}
