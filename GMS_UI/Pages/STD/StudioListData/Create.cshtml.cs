using GMS_UI.Models.Enum;
using GMS_UI.Models.STD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace GMS_UI.Pages.STD.StudioListData
{
    public class CreateModel : PageModel
    {

        [BindProperty]
        public STDCreateStudioViewModel Input { get; set; } = new();

        [TempData]
        public string BlindingTypeSL { get; set; } = string.Empty;

        [TempData]
        public string PhaseTypeSL { get; set; } = string.Empty;

        [TempData]
        public string RandomizationTypeSL { get; set; } = string.Empty;

        [TempData]
        public string StudioStatusSL { get; set; } = string.Empty;

        [TempData]
        public string ArmSL { get; set; } = string.Empty;


        public IActionResult OnGet()
        {
            // Initialize select lists
            LoadSelectListsAsync();

            return Page();
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
            foreach (var item in Enum.GetValues(typeof(StudioPhaseEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudioPhaseEnum), value) ?? "";

                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }

            PhaseTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            // Load RandomizationTypeSL from Enum
            #region RandomizationTypeSL...
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(StudioRandomizationTypeEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudioRandomizationTypeEnum), value) ?? "";

                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }

            RandomizationTypeSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
            #endregion

            // Load StudioStatusSL from Enum
            #region StudioStatusSL...
            comboValue.Clear();
            foreach (var item in Enum.GetValues(typeof(StudioStatusEnum)))
            {
                var value = (int)item;
                var text = Enum.GetName(typeof(StudioStatusEnum), value) ?? "";

                comboValue.Add(new ComboValues
                {
                    Id = value,
                    Name = text,
                });
            }

            StudioStatusSL = JsonSerializer.Serialize(comboValue.OrderBy(e => e.Name));
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
