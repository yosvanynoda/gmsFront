namespace GMS_UI.Models.STD
{
    public class STDVisitViewModel
    {
        public int VisitID { get; set; } = 0;

        public int StudyID { get; set; } = 0;

        public int ArmID { get; set; } = 0;

        public string Name { get; set; } = string.Empty;

        public int DayOffset { get; set; } = 0;

        public int WindowMinus { get; set; } = 0;

        public int WindowPlus { get; set; } = 0;

        public bool RequiredFlag { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public string? Comment { get; set; } = string.Empty;

        public int DependencyOf { get; set; } = 0;

        public decimal Cost { get; set; } = 0;

        public int VisitType { get; set; } = 0;
    }
}
