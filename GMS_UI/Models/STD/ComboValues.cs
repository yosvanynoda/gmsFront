using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace GMS_UI.Models.STD
{
    public class ComboValues
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("id")]
        public int Id { get; set; } = 0;
    }
}
