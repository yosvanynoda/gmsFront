using GMS.BL.Generic;
using GMS_UI.Helper;
using GMS_UI.Models.Enum;
using GMS_UI.Models.STD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace GMS_UI.Pages.STD.StudioListData
{
    public class CreateModel(ILogger<CreateModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<CreateModel> _logger = logger;
        private readonly ISettings _settings = settings;

        [TempData]
        public string BlindingTypeSL { get; set; } = string.Empty;

        [TempData]
        public string PhaseTypeSL { get; set; } = string.Empty;

        [TempData]
        public string StudyDesignTypeSL { get; set; } = string.Empty;

        [TempData]
        public string StudyStatusSL { get; set; } = string.Empty;

        [TempData]
        public string ArmSL { get; set; } = string.Empty;


        public IActionResult OnGet()
        {
            // Initialize select lists
            LoadSelectListsAsync();

            return Page();
        }

        public async Task<JsonResult> OnPostSaveStudy(STDCreateStudioViewModel studioData)
        {
            try
            {
                var result = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateVolunteer(), "Create Study", "", studioData);

                _logger.LogInformation("API Result - Success: {Success}, Message: {Message}",
                    result?.Success, result?.Message);

                if (result?.Success == true)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Study created successfully",
                        data = result.Data
                    });
                }
                else
                {
                    var errorMessage = result?.Message ?? "Error creating Study - no message from API";
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

        private void LoadSelectListsAsync()
        {
            // Load blindingType from Enum
            #region blindingType...
            var comboValue = new List<ComboValues>();
            foreach (var item in Enum.GetValues(typeof(StudioBlindingTypeEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudioBlindingTypeEnum), value) ?? "";

                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }

            BlindingTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            // Load PhaseTypeSL from Enum
            #region PhaseTypeSL...
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

            PhaseTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            //// Load RandomizationTypeSL from Enum
            #region RandomizationTypeSL...
            //comboValue.Clear();
            //foreach (var item in Enum.GetValues(typeof(StudioRandomizationTypeEnum)))
            //{
            //    var value = (int)item;
            //    var text = Enum.GetName(typeof(StudioRandomizationTypeEnum), value) ?? "";

            //    comboValue.Add(new ComboValues
            //    {
            //        Id = value,
            //        Name = text,
            //    });
            //}

            //RandomizationTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            // Load StudioStatusSL from Enum
            #region StudioStatusSL...
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

            StudyStatusSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            //StudyDesignTypeEnum
            #region StudyDesignTypeEnum
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

            StudyDesignTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            // Load ArmSL from Enum
            #region ArmSL...
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(ArmEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(ArmEnum), value) ?? "";

                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }

            ArmSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion
        }
    }
}
