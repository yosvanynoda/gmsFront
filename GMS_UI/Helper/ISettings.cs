namespace GMS_UI.Helper
{
    public interface ISettings
    {
        string ApiUrl();

        #region CMN...
        string Endpoint_CreateCompany();

        string Endpoint_CreateAllergy();

        string Endpoint_CreateDisease();

        string Endpoint_CreateDeviation();

        string Endpoint_CreateMedication();

        string Endpoint_CreateDocType();

        string Endpoint_CreateRoleType();

        string Endpoint_CreateSite();

        string Endpoint_CreateSponsorType();

        string Endpoint_CreateStaff();

        string Endpoint_CreateTask();

        string Endpoint_CreateTaskType();

        string Endpoint_GetAllergyList();

        string Endpoint_GetDiseaseList();

        string Endpoint_GetDiseaseDropList();

        string Endpoint_GetDeviationList();

        string Endpoint_GetDeviationDropList();

        string Endpoint_GetMedicationList();

        string Endpoint_GetDocType();

        string Endpoint_GetDocTypeDropList();

        string Endpoint_GetRoleTypeList();

        string Endpoint_GetSiteList();

        string Endpoint_GetSponsorTypeList();

        string Endpoint_GetStaffList();

        string Endpoint_GetTaskList();

        string Endpoint_GetTaskTypeList();

        string Endpoint_GetRelationTypeList();

        string Endpoint_CreateRelationType();

        string Endpoint_GetEthnicityList();

        string Endpoint_CreateEthnicity();

        string Endpoint_GetLanguageList();

        string Endpoint_GetGenderList();

        string Endpoint_CreateGender();

        string Endpoint_GetRaceList();

        string Endpoint_CreateLanguage();

        string Endpoint_CreateRace();

        string Endpoint_GetCROList();

        string Endpoint_GetCRODropList();

        string Endpoint_CreateCRO();

        string Endpoint_GetVLTStatusList();

        string Endpoint_CreateVLTStatus();

        #endregion

        #region STD....

        string Endpoint_GetMonitorList();

        string Endpoint_GetMonitorDropList();

        string Endpoint_CreateMonitor();

        string Endpoint_GetProtocolList();

        string Endpoint_CreateProtocol();

        string Endpoint_GetSponsorList();

        string Endpoint_GetSponsorDropList();

        string Endpoint_CreateSponsor();

        string Endpoint_GetStudioList();

        string Endpoint_GetSubjectList();

        string Endpoint_GetStudioDocList();

        string Endpoint_CreateStudioDoc();

        string Endpoint_CreateStudioStaff();

        string Endpoint_GetStaffStudio();

        string Endpoint_GetProtocolVersionList();

        string Endpoint_CreateStudyData();

        #endregion

        #region SUB....

        string Endpoint_GetSubjectData();

        string Endpoint_CreateVisit();

        #endregion

        #region VLT...

        string Endpoint_GetVolunteerList();

        string Endpoint_GetVolunteerData();

        string Endpoint_CreateVolunteer();

        string Endpoint_UpdateVolunteer();

        string Endpoint_GetVLTStatusDropList();


        #endregion
    }
}
