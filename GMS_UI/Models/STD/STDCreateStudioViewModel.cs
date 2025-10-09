namespace GMS_UI.Models.STD
{
    public class STDCreateStudioViewModel
    {
        public STDGeneralDataViewModel STDGeneralData { get; set; } = new();

        public List<STDDocumentationViewModel> STDDocumentation { get; set; } = [];

        public List<STDMonitorViewModel> STDMonitor { get; set; } = [];

        public List<STDProtocolViewModel> STDProtocol { get; set; } = [];

        public List<STDArmsViewModel> STDArms { get; set; } = [];

        public List<STDVisitViewModel> STDVisits { get; set; } = [];
    }
}
