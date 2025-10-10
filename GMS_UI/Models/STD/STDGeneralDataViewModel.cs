namespace GMS_UI.Models.STD
{
    public class STDGeneralDataViewModel
    {
        public int STDId { get; set; } = 0;

        public string Code { get; set; } = string.Empty;

        public int SponsorId { get; set; } = 0;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        public DateTime DateCreated { get; set; } = DateTime.MinValue;

        public int CompanyId { get; set; } = 0;

        public int ProtocolId { get; set; } = 0;

        public int UserName { get; set; } = 0;

        public bool Active { get; set; } = false;

        public int SiteId { get; set; } = 0;

        public int Goal { get; set; } = 0;

        public int Phase { get; set; } = 0;

        public string Indication { get; set; } = string.Empty;

        public string TherapeuticArea { get; set; } = string.Empty;

        public int BlindingType { get; set; } = 0;

        public int RandomizationType { get; set; } = 0;

        public DateTime StartDate { get; set; } = DateTime.MinValue;

        public DateTime EndDate { get; set; } = DateTime.MinValue;

        public int StudioStatus { get; set; } = 0;

        public int DiseaseId { get; set; } = 0;

        public int CROId { get; set; } = 0;
    }
}
