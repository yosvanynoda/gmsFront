namespace GMS_UI.Models.CMN
{
    public class DocTypeViewModel
    {
        public int Id { get; set; }

        public string DocType { get; set; }

        public string? Comment { get; set; }

        public int CompanyId { get; set; }

        public int? UserName { get; set; }

        public DateTime ActionDateTime { get; set; }

        public bool? Active { get; set; }

        public DateTime? LastUpdateAt { get; set; }

        public string ApplyFor { get; set; }

        public int ApplyForId { get; set; }

        public DocTypeViewModel()
        {
            DocType = "";

            ApplyFor = "";
        }
    }
}
