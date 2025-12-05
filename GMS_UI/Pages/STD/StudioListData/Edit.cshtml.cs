using GMS.BL.Generic;
using GMS.Objects.API;
using GMS_UI.Helper;
using GMS_UI.Models.Enum;
using GMS_UI.Models.STD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.StudioListData
{
    public class EditModel(ILogger<EditModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<EditModel> _logger = logger;
        private readonly ISettings _settings = settings;

        [TempData]
        public string BlindingTypeSL { get; set; } = string.Empty;

        [TempData]
        public string PhaseTypeSL { get; set; } = string.Empty;

        [TempData]
        public string StudyDesignTypeSL { get; set; } = string.Empty;

        [TempData]
        public string StudyStatusSL { get; set; } = string.Empty;

        public IActionResult OnGet()
        {
            // Initialize select lists
            LoadSelectListsAsync();

            return Page();
        }

        public async Task<IActionResult> OnGetGetStudioData(int studioId)
        {
            try
            {
                var requestData = new
                {
                    CompanyId = 1,
                    SiteId = 1,
                    StudyId = studioId
                };

                var result = await GenericAPI.GetGeneric<StudioDataResponse>(_settings.ApiUrl(),
                    _settings.Endpoint_GetStudioData(),
                    "Get Studio Data", "", requestData);

                if (result?.Success == true)
                {
                    _logger.LogInformation("API Result Data: {Data}", JsonConvert.SerializeObject(result.Data));

                    // Return result.Data directly - now strongly-typed to preserve all properties
                    var response = new
                    {
                        success = true,
                        data = result.Data
                    };

                    var responseJson = JsonConvert.SerializeObject(response);
                    return Content(responseJson, "application/json");
                }
                else
                {
                    var errorResponse = new
                    {
                        success = false,
                        message = result?.Message ?? "Error getting Studio data"
                    };
                    return Content(JsonConvert.SerializeObject(errorResponse), "application/json");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetStudioData: {Message}", ex.Message);
                var errorResponse = new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                };
                return Content(JsonConvert.SerializeObject(errorResponse), "application/json");
            }
        }

        public async Task<JsonResult> OnPostUpdateStudy(STDCreateStudioViewModel studioData)
        {
            try
            {
                studioData.CompanyId = 1;
                studioData.Username = 1;
                studioData.SiteId = 1;

                var result = await GenericAPI.CreateGeneric(_settings.ApiUrl(),
                    _settings.Endpoint_UpdateStudyData(),
                    "Update Study", "", studioData);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Study updated successfully",
                        data = result.Data
                    });
                }
                else
                {
                    var errorMessage = result?.Message ?? "Error updating Study";
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
                _logger.LogError(ex, "Exception in OnPostUpdateStudy: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }

        private void LoadSelectListsAsync()
        {
            var comboValue = new List<ComboValues>();

            // Load blindingType
            foreach (var kvp in StaticDictionary.StudioBlindingTypeDictionary)
            {
                comboValue.Add(new ComboValues
                {
                    Id = kvp.Key,
                    Name = kvp.Value,
                });
            }
            BlindingTypeSL = JsonConvert.SerializeObject(comboValue.OrderBy(e => e.Name));

            // Load PhaseTypeSL
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(StudyPhaseEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudyPhaseEnum), value) ?? "";
                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }
            PhaseTypeSL = JsonConvert.SerializeObject(comboValue.OrderBy(e => e.Name));

            // Load StudioStatusSL
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(StudyStatusEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudyStatusEnum), value) ?? "";
                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }
            StudyStatusSL = JsonConvert.SerializeObject(comboValue.OrderBy(e => e.Name));

            // Load StudyDesignTypeEnum
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(StudyDesignTypeEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudyDesignTypeEnum), value) ?? "";
                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }
            StudyDesignTypeSL = JsonConvert.SerializeObject(comboValue.OrderBy(e => e.Name));
        }
    }
}
