namespace GMS_UI.Models.STD
{
    public class STDVisitViewModel
    {

        public string Name { get; set; } = string.Empty;

        public int DayOffset { get; set; } = 0;

        public int WindowMinus { get; set; } = 0;

        public int WindowPlus { get; set; } = 0;

        public bool RequiredFlag { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public string? Comment { get; set; } = string.Empty;
    }
}
