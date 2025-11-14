using System.ComponentModel;
using System.Reflection;

namespace GMS_UI.Helper
{
    public static class EnumExtension
    {
        public static string ToDescription(this Enum value)
        {
            FieldInfo? field = value.GetType().GetField(value.ToString());
            return field != null ? Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) is not DescriptionAttribute attribute ? value.ToString() : attribute.Description : value.ToString();
        }

    }
}
