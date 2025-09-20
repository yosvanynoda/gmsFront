namespace GMS_UI.Models.STD
{
    public class StudioListViewModel
    {
        public int Id { get; set; }

        public string Code { get; set; }

        public int SponsorId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string? Notes { get; set; }

        public DateTime? DateCreated { get; set; }

        public int CompanyId { get; set; }

        public int ProtocolId { get; set; }

        public int UserName { get; set; }

        public DateTime? ActionDateTime { get; set; }

        public bool Active { get; set; }

        public DateTime? LastUpdatedAt { get; set; }

        public int SiteId { get; set; }

        public int Goal { get; set; }

        public int Phase { get; set; }

        public string Indication { get; set; }

        public string TherapeuticArea { get; set; }

        public int BlindType { get; set; }

        public int RandomizationType { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int StudioStatus { get; set; }

        public string ProtocolName { get; set; }

        public string SponsorName { get; set; }

        public string SiteName { get; set; }

        public string StudioStatusName { get; set; }

        public StudioListViewModel()
        {
            Code = "";

            Name = "";

            Description = "";

            Indication = "";

            TherapeuticArea = "";

            ProtocolName = "";

            SponsorName = "";

            SiteName = "";

            StudioStatusName = "";
        }
    }
}
