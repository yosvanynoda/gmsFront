namespace GMS_UI.Models.STD
{
    public class STDDocumentationViewModel
    {
        public int DocumentTypeId { get; set; } = 0;

        public string DocName { get; set; } = string.Empty;

        public DateTime DocDate { get; set; } = DateTime.MinValue;

        public string DocVersion { get; set; } = string.Empty;

        public bool DocActive { get; set; } = false;

        public string Notes { get; set; } = string.Empty;

    }
}
