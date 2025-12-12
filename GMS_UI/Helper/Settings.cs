namespace GMS_UI.Helper
{
    public class Settings(IConfiguration config) : ISettings
    {
        private readonly IConfiguration _config = config;

        public string ApiUrl() => _config["ApiBaseUrl"] ?? "";

        #region CMN...
        public string Endpoint_CreateCompany() => _config["Endpoint_CreateCompany"] ?? "";

        public string Endpoint_CreateAllergy() => _config["Endpoint_CreateAllergy"] ?? "";

        public string Endpoint_CreateMedication() => _config["Endpoint_CreateMedication"] ?? "";

        public string Endpoint_CreateDisease()=> _config["Endpoint_CreateDisease"] ?? "";

        public string Endpoint_CreateDeviation()=> _config["Endpoint_CreateDeviation"] ?? "";

        public string Endpoint_CreateDocType()=> _config["Endpoint_CreateDocType"] ?? "";

        public string Endpoint_CreateRoleType()=> _config["Endpoint_CreateRoleType"] ?? "";

        public string Endpoint_CreateSite()=> _config["Endpoint_CreateSite"] ?? "";

        public string Endpoint_CreateSponsorType()=> _config["Endpoint_CreateSponsorType"] ?? "";

        public string Endpoint_CreateStaff()=> _config["Endpoint_CreateStaff"] ?? "";

        public string Endpoint_CreateTask()=> _config["Endpoint_CreateTask"] ?? "";

        public string Endpoint_CreateTaskType()=> _config["Endpoint_CreateTaskType"] ?? "";

        public string Endpoint_GetAllergyList() => _config["Endpoint_GetAllergyList"] ?? "";

        public string Endpoint_GetMedicationList() => _config["Endpoint_GetMedicationList"] ?? "";

        public string Endpoint_GetDiseaseList()=> _config["Endpoint_GetDiseaseList"] ?? "";

        public string Endpoint_GetDiseaseDropList() => _config["Endpoint_GetDiseaseDropList"] ?? "";

        public string Endpoint_GetDeviationList()=> _config["Endpoint_GetDeviationList"] ?? "";

        public string Endpoint_GetDeviationDropList() => _config["Endpoint_GetDeviationDropList"] ?? "";

        public string Endpoint_GetDocType()=> _config["Endpoint_GetDocType"] ?? "";

        public string Endpoint_GetDocTypeDropList() => _config["Endpoint_GetDocTypeDropList"] ?? "";

        public string Endpoint_GetRoleTypeList()=> _config["Endpoint_GetRoleTypeList"] ?? "";

        public string Endpoint_GetSiteList()=> _config["Endpoint_GetSiteList"] ?? "";

        public string Endpoint_GetSponsorTypeList()=> _config["Endpoint_GetSponsorTypeList"] ?? "";

        public string Endpoint_GetStaffList()=> _config["Endpoint_GetStaffList"] ?? "";

        public string Endpoint_GetStaffDropList() => _config["Endpoint_GetStaffDropList"] ?? "";

        public string Endpoint_GetTaskList()=> _config["Endpoint_GetTaskList"] ?? "";

        public string Endpoint_GetTaskTypeList()=> _config["Endpoint_GetTaskTypeList"] ?? "";

        public string Endpoint_GetRelationTypeList() => _config["Endpoint_GetRelationTypeList"] ?? "";

        public string Endpoint_CreateRelationType() => _config["Endpoint_CreateRelationType"] ?? "";

        public string Endpoint_GetEthnicityList() => _config["Endpoint_GetEthnicityList"] ?? "";

        public string Endpoint_CreateEthnicity() => _config["Endpoint_CreateEthnicity"] ?? "";

        public string Endpoint_GetLanguageList() => _config["Endpoint_GetLanguageList"] ?? "";

        public string Endpoint_GetGenderList() => _config["Endpoint_GetGenderList"] ?? "";

        public string Endpoint_CreateGender() => _config["Endpoint_CreateGender"] ?? "";

        public string Endpoint_GetRaceList() => _config["Endpoint_GetRaceList"] ?? "";

        public string Endpoint_CreateRace() => _config["Endpoint_CreateRace"] ?? "";
        
        public string Endpoint_CreateLanguage() => _config["Endpoint_CreateLanguage"] ?? "";

        public string Endpoint_GetCROList() => _config["Endpoint_GetCROList"] ?? "";

        public string Endpoint_GetCRODropList() => _config["Endpoint_GetCRODropList"] ?? "";

        public string Endpoint_CreateCRO() => _config["Endpoint_CreateCRO"] ?? "";

        public string Endpoint_GetVLTStatusList() => _config["Endpoint_GetVLTStatusList"] ?? "";

        public string Endpoint_CreateVLTStatus() => _config["Endpoint_CreateVLTStatus"] ?? "";

        #endregion

        #region STD....
        public string Endpoint_GetMonitorList() => _config["Endpoint_GetMonitorList"] ?? "";

        public string Endpoint_GetMonitorDropList() => _config["Endpoint_GetMonitorDropList"] ?? "";

        public string Endpoint_CreateMonitor() => _config["Endpoint_CreateMonitor"] ?? "";

        public string Endpoint_GetProtocolList() => _config["Endpoint_GetProtocolList"] ?? "";

        public string Endpoint_CreateProtocol() => _config["Endpoint_CreateProtocol"] ?? "";

        public string Endpoint_GetSponsorList() => _config["Endpoint_GetSponsorList"] ?? "";

        public string Endpoint_GetSponsorDropList() => _config["Endpoint_GetSponsorDropList"] ?? "";

        public string Endpoint_CreateSponsor() => _config["Endpoint_CreateSponsor"] ?? "";

        public string Endpoint_GetStudioList() => _config["Endpoint_GetStudioList"] ?? "";

        public string Endpoint_GetSubjectList() => _config["Endpoint_GetSubjectList"] ?? "";

        public string Endpoint_GetStudioDocList() => _config["Endpoint_GetStudioDocList"] ?? "";

        public string Endpoint_CreateStudioDoc() => _config["Endpoint_CreateStudioDoc"] ?? "";

        public string Endpoint_CreateStudioStaff() => _config["Endpoint_CreateStudioStaff"] ?? "";

        public string Endpoint_GetStaffStudio() => _config["Endpoint_GetStaffStudio"] ?? "";

        public string Endpoint_GetProtocolVersionList() => _config["Endpoint_GetProtocolVersionList"] ?? "";

        public string Endpoint_CreateStudyData() => _config["Endpoint_CreateStudyData"] ?? "";
        public string Endpoint_UpdateStudyData() => _config["Endpoint_UpdateStudyData"] ?? "";
        public string Endpoint_GetStudioData() => _config["Endpoint_GetStudioData"] ?? "";

        #endregion

        #region SUB....

        public string Endpoint_GetSubjectData() => _config["Endpoint_GetSubjectData"] ?? "";

        public string Endpoint_UpdateSubject() => _config["Endpoint_UpdateSubject"] ?? "";

        public string Endpoint_CreateVisit() => _config["Endpoint_CreateVisit"] ?? "";

        public string Endpoint_CancelVisit() => _config["Endpoint_CancelVisit"] ?? "";

        #endregion

        #region VLT...

        public string Endpoint_GetVolunteerList() => _config["Endpoint_GetVolunteerList"] ?? "";

        public string Endpoint_GetVolunteerData() => _config["Endpoint_GetVolunteerData"] ?? "";

        public string Endpoint_CreateVolunteer() => _config["Endpoint_CreateVolunteer"] ?? "";

        public string Endpoint_UpdateVolunteer() => _config["Endpoint_UpdateVolunteer"] ?? "";

        public string Endpoint_GetVLTStatusDropList() => _config["Endpoint_GetVLTStatusDropList"] ?? "";
        


        #endregion
    }
}
