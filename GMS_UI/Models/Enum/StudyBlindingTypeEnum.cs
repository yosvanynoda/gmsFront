using System.ComponentModel;

namespace GMS_UI.Models.Enum
{
    public enum StudioBlindingTypeEnum
    {
        //Open-label|Single|Double

        [Description("Open-label")]
        OpenLabel = 1,

        [Description("Single-Blind")]
        SingleBlind = 2,

        [Description("Double-Blind")]
        DoubleBlind = 3
    }
}
