namespace GMS_UI.Models.STD
{
    public class STDCreateStudioViewModel
    {
        public List<STDGeneralDataViewModel> STDGeneralData { get; set; } = new();

        public List<STDDocumentationViewModel> STDDocumentation { get; set; } = [];

        public List<STDMonitorRoleViewModel> STDMonitor { get; set; } = [];

        public List<STDProtocolViewModel> STDProtocol { get; set; } = [];

        public List<STDArmsViewModel> STDArms { get; set; } = [];

        public List<STDVisitViewModel> STDVisits { get; set; } = [];

        public int CompanyId { get; set; }

        public int SiteId { get; set; }

        public int Username { get; set; }
    }
}
