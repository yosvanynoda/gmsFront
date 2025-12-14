namespace GMS_UI.Models.VLT
{
    public class VLTVolunteerSearchResult
    {
        public int VolunteerId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string SubjectId { get; set; } = string.Empty;
        public int Age { get; set; }
        public string SubjectDOB { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Race { get; set; } = string.Empty;
        public string Ethnicity { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string SubjectEmail { get; set; } = string.Empty;
        public bool IsAssignedToStudy { get; set; }
    }
}
