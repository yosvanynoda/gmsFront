using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GMS_UI.Pages.VLT.Volunteer
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
        public int VolunteerId { get; set; }

        public List<SelectListItem> RaceList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> EthnicityList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> GenderList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> LanguageList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> AllergyList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> DiseaseList { get; set; } = new List<SelectListItem>();
        public List<SelectListItem> MedicationList { get; set; } = new List<SelectListItem>();

        public object? VolunteerData { get; set; }

        public async Task OnGetAsync()
        {
            var requestData = new GeneralCompanySiteRequest
            {
                CompanyId = 1,
                SiteId = 1,
            };

            // Load dropdown lists
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

            var allergyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetAllergyList(), "Allergy List", "", requestData);
            if (allergyResponse?.Success == true && allergyResponse.Data != null)
            {
                var allergyData = JsonConvert.DeserializeObject<List<AllergyBaseResponse>>(allergyResponse.Data.ToString());
                AllergyList = allergyData?.Select(a => new SelectListItem { Value = a.Id.ToString(), Text = a.Allergy }).ToList() ?? new List<SelectListItem>();
            }

            var diseaseResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDiseaseList(), "Disease List", "", requestData);
            if (diseaseResponse?.Success == true && diseaseResponse.Data != null)
            {
                var diseaseData = JsonConvert.DeserializeObject<List<DiseaseBaseResponse>>(diseaseResponse.Data.ToString());
                DiseaseList = diseaseData?.Select(d => new SelectListItem { Value = d.DiseaseId.ToString(), Text = d.DiseaseName }).ToList() ?? new List<SelectListItem>();
            }

            var medicationResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetMedicationList(), "Medication List", "", requestData);
            if (medicationResponse?.Success == true && medicationResponse.Data != null)
            {
                var medicationData = JsonConvert.DeserializeObject<List<MedicationBaseResponse>>(medicationResponse.Data.ToString());
                MedicationList = medicationData?.Select(m => new SelectListItem { Value = m.MedicationId.ToString(), Text = m.MedicationName }).ToList() ?? new List<SelectListItem>();
            }

            // Load volunteer data
            var volunteerRequest = new VolunteerRequest
            {
                CompanyId = 1,
                SiteId = 1,
                VolunteerId = VolunteerId
            };

            _logger.LogInformation("Fetching volunteer data for VolunteerId: {VolunteerId}, CompanyId: 1, SiteId: 1", VolunteerId);

            var volunteerResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetVolunteerData(), "Volunteer Data", "", volunteerRequest);

            _logger.LogInformation("Volunteer Response - Success: {Success}, Data: {Data}",
                volunteerResponse?.Success,
                volunteerResponse?.Data != null ? JsonConvert.SerializeObject(volunteerResponse.Data) : "null");

            if (volunteerResponse?.Success == true && volunteerResponse.Data != null)
            {
                // Just assign the Data directly - it's already deserialized
                VolunteerData = volunteerResponse.Data;
                _logger.LogInformation("Volunteer data assigned. Type: {Type}", VolunteerData?.GetType().Name);
                _logger.LogInformation("Volunteer data content: {Content}", JsonConvert.SerializeObject(VolunteerData));
            }
            else
            {
                _logger.LogWarning("Failed to load volunteer data: {Message}", volunteerResponse?.Message);
            }
        }

        public async Task<JsonResult> OnPostUpdateAsync()
        {
            try
            {
                _logger.LogInformation("OnPostUpdateAsync called");

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
                    _settings.ApiUrl(), _settings.Endpoint_UpdateVolunteer());

                var result = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_UpdateVolunteer(), "Update Volunteer", "", volunteerData);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Volunteer updated successfully",
                        data = result.Data
                    });
                }
                else
                {
                    var errorMessage = result?.Message ?? "Error updating volunteer - no message from API";
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
                _logger.LogError(ex, "Exception in OnPostUpdateAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message} | Stack: {ex.StackTrace}"
                });
            }
        }
    }
}
