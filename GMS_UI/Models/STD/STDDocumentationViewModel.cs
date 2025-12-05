namespace GMS_UI.Models.STD
{
    public class STDDocumentationViewModel
    {
        public int VId { get; set; } = 0;

        public int DocumentTypeId { get; set; } = 0;

        public string DocName { get; set; } = string.Empty;

        public DateTime DocDate { get; set; } = DateTime.MinValue;

        public string DocVersion { get; set; } = string.Empty;

        public bool DocActive { get; set; } = false;

        public string Notes { get; set; } = string.Empty;

        public int CompanyId { get; set; } = 0;

        public int UserName { get; set; } = 0;

        public bool Active { get; set; } = false;

        public int SiteId { get; set; } = 0;

        public string? DocPath { get; set; } = string.Empty;

        public IFormFile? Document { get; set; }

    }
}
