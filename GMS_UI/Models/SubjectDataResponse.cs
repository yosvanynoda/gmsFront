namespace GMS_UI.Models
{
    public class SubjectDataResponse
    {
        public SubjectHeader? Header { get; set; }
        public List<ConsentRecord>? Consent { get; set; }
        public List<DeviationRecord>? Deviation { get; set; }
        public List<AdverseRecord>? Adverse { get; set; }
    }

    public class SubjectHeader
    {
        public int SubjectId { get; set; }
        public int VolunteerId { get; set; }
        public string SubjectCode { get; set; } = string.Empty;
        public DateTime DateCrated { get; set; }
        public string CurrentStatus { get; set; } = string.Empty;
        public int CurrentStatusId { get; set; }
        public int StudyId { get; set; }
        public string StudyName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime SubjectDOB { get; set; }
        public string RandomCode { get; set; } = string.Empty;
        public DateTime RamdoDate { get; set; }
    }

    public class ConsentRecord
    {
        public int ConsentID { get; set; }
        public int SubjectId { get; set; }
        public int StudyId { get; set; }
        public int ProtocolVersionId { get; set; }
        public DateTime ConsentDate { get; set; }
        public bool ReconsentFlag { get; set; }
        public string ProtocolVersion { get; set; } = string.Empty;
    }

    public class DeviationRecord
    {
        public int PDevID { get; set; }
        public int StudyId { get; set; }
        public int SubjectID { get; set; }
        public int VisitID { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Severity { get; set; }
        public DateTime ReportedDate { get; set; }
        public string Outcome { get; set; } = string.Empty;
        public int DeviationId { get; set; }
        public string DeviationName { get; set; } = string.Empty;
        public string DeviationCode { get; set; } = string.Empty;
    }

    public class AdverseRecord
    {
        public int AEID { get; set; }
        public int SubjectId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Severity { get; set; } = string.Empty;
        public string RelationshipToIP { get; set; } = string.Empty;
        public bool SeriousFlag { get; set; }
        public string SAECriteria { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public string MedDRACode { get; set; } = string.Empty;
    }
}
