using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS_UI.Helper;
using GMS_UI.Models.CMN;
using GMS_UI.Models.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Newtonsoft.Json;

namespace GMS_UI.Pages.CMN.ReferenceData
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;


        #region ====== Gender ======
        public async Task<JsonResult> OnPostGenderList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse genders = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetGenderList(), "a Gender List", "", requestData);

                if (genders == null || genders.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Gender List",
                        success = false,
                        data = new List<GenderBaseResponse>()
                    });
                }

                if (genders.Success && genders.Data != null)
                {
                    List<GenderBaseResponse> result = JsonConvert.DeserializeObject<List<GenderBaseResponse>>(genders.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Gender List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = genders.Message,
                        success = false,
                        data = new List<GenderBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<GenderBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudGender(string gender, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateGenderRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Gender = gender,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateGender(), "a Gender", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }
        #endregion

        #region ====== Allergy ======
        public async Task<JsonResult> OnPostAllergyList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse allergys = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetAllergyList(), "a Allergy List", "", requestData);

                if (allergys == null || allergys.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Allergy List",
                        success = false,
                        data = new List<AllergyBaseResponse>()
                    });
                }

                if (allergys.Success && allergys.Data != null)
                {
                    List<AllergyBaseResponse> result = JsonConvert.DeserializeObject<List<AllergyBaseResponse>>(allergys.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Allergy List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = allergys.Message,
                        success = false,
                        data = new List<AllergyBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<AllergyBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudAllergy(string allergy, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateAllergyRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Allergy = allergy,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateAllergy(), "a Allergy", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }
        #endregion

        #region ====== Disease ======
        public async Task<JsonResult> OnPostDiseaseList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse diseases = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDiseaseList(), "a Disease List", "", requestData);

                if (diseases == null || diseases.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Disease List",
                        success = false,
                        data = new List<DiseaseBaseResponse>()
                    });
                }

                if (diseases.Success && diseases.Data != null)
                {
                    List<DiseaseBaseResponse> result = JsonConvert.DeserializeObject<List<DiseaseBaseResponse>>(diseases.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Disease List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = diseases.Message,
                        success = false,
                        data = new List<DiseaseBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DiseaseBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudDisease(string disease, int action, int id, string diseasecode)
        {
            try
            {
                var createRequest = new CreateDiseaseRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    DiseaseName = disease,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    DiseaseCode = diseasecode,
                    DiseaseId = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateDisease(), "a Disease", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        public async Task<JsonResult> OnPostDiseaseDropList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse diseases = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDiseaseDropList(), "a Disease List", "", requestData);

                if (diseases == null || diseases.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Disease List",
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }

                if (diseases.Success && diseases.Data != null)
                {
                    List<DropListBaseResponse> result = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(diseases.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Disease List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = diseases.Message,
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DropListBaseResponse>()
                });
            }

        }
        #endregion

        #region ====== Medication ======
        public async Task<JsonResult> OnPostMedicationList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse medications = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetMedicationList(), "a Medication List", "", requestData);

                if (medications == null || medications.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Medication List",
                        success = false,
                        data = new List<MedicationBaseResponse>()
                    });
                }

                if (medications.Success && medications.Data != null)
                {
                    List<MedicationBaseResponse> result = JsonConvert.DeserializeObject<List<MedicationBaseResponse>>(medications.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Medication List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = medications.Message,
                        success = false,
                        data = new List<MedicationBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<MedicationBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudMedication(string medication, string dose, int action, int id)
        {
            try
            {
                var createRequest = new CreateMedicationRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    MedicationName = medication,
                    MedicationDose = dose,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    MedicationId = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateMedication(), "a Medication", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }
        #endregion

        #region ====== Doc Type ======

        public async Task<JsonResult> OnPostDocTypeList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse docTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDocType(), "a DocType ", "", requestData);

                if (docTypes == null || docTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading DocType",
                        success = false,
                        data = new List<DocTypeViewModel>()
                    });
                }

                if (docTypes.Success && docTypes.Data != null)
                {
                    List<DocTypeBaseResponse>? result = JsonConvert.DeserializeObject<List<DocTypeBaseResponse>>(docTypes.Data.ToString());

                    if(result == null)
                    {
                        return new JsonResult(new
                        {
                            errorCode = 500,
                            errorMessage = "Error processing DocType data",
                            success = false,
                            data = new List<DocTypeViewModel>()
                        });
                    }

                    List<DocTypeViewModel> viewModelResult = [.. result.Select(dt => new DocTypeViewModel
                    {
                        Id = dt.Id,
                        DocType = dt.DocType,
                        Comment = dt.Comment,
                        CompanyId = dt.CompanyId,
                        UserName = dt.UserName,
                        ActionDateTime = dt.ActionDateTime,
                        Active = dt.Active,
                        LastUpdateAt = dt.LastUpdateAt,
                        ApplyFor = ((ApplyForEnum)dt.ApplyFor).ToString(),
                        ApplyForId = dt.ApplyFor
                    })];

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "DocType was read successfully",
                        success = true,
                        data = viewModelResult
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = docTypes.Message,
                        success = false,
                        data = new List<DocTypeViewModel>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DocTypeViewModel>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudDocType(string docType, string? comment, int applyFor, int action, int id)
        {
            try
            {
                var createRequest = new CreateDocTypeRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    DocType = docType,
                    Comment = comment,
                    ApplyFor = applyFor,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateDocType(), "a DocType", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        public async Task<JsonResult> OnPostDocTypeDropList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse docTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetDocTypeDropList(), "a DocType ", "", requestData);

                if (docTypes == null || docTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading DocType",
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }

                if (docTypes.Success && docTypes.Data != null)
                {
                    List<DropListBaseResponse>? result = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(docTypes.Data.ToString());

                    if (result == null)
                    {
                        return new JsonResult(new
                        {
                            errorCode = 500,
                            errorMessage = "Error processing DocType data",
                            success = false,
                            data = new List<DropListBaseResponse>()
                        });
                    }

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "DocType was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = docTypes.Message,
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DropListBaseResponse>()
                });
            }

        }

        #endregion

        #region ====== Ethnicity ======

        public async Task<JsonResult> OnPostEthnicityList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse ethnicitys = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetEthnicityList(), "a Ethnicity List", "", requestData);

                if (ethnicitys == null || ethnicitys.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Ethnicity List",
                        success = false,
                        data = new List<EthnicityBaseResponse>()
                    });
                }

                if (ethnicitys.Success && ethnicitys.Data != null)
                {
                    List<EthnicityBaseResponse> result = JsonConvert.DeserializeObject<List<EthnicityBaseResponse>>(ethnicitys.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Ethnicity List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = ethnicitys.Message,
                        success = false,
                        data = new List<EthnicityBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<EthnicityBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudEthnicity(string ethnicity, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateEthnicityRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Ethnicity = ethnicity,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateEthnicity(), "a Ethnicity", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Language =====

        public async Task<JsonResult> OnPostLanguageList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse languages = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetLanguageList(), "a Language List", "", requestData);

                if (languages == null || languages.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Language List",
                        success = false,
                        data = new List<LanguageBaseResponse>()
                    });
                }

                if (languages.Success && languages.Data != null)
                {
                    List<LanguageBaseResponse> result = JsonConvert.DeserializeObject<List<LanguageBaseResponse>>(languages.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Language List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = languages.Message,
                        success = false,
                        data = new List<LanguageBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<LanguageBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudLanguage(string language, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateLanguageRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Language = language,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateLanguage(), "a Language", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }
        #endregion

        #region ====== Race ======

        public async Task<JsonResult> OnPostRaceList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse races = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRaceList(), "a Race List", "", requestData);

                if (races == null || races.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Race List",
                        success = false,
                        data = new List<RaceBaseResponse>()
                    });
                }

                if (races.Success && races.Data != null)
                {
                    List<RaceBaseResponse> result = JsonConvert.DeserializeObject<List<RaceBaseResponse>>(races.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Race List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = races.Message,
                        success = false,
                        data = new List<RaceBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<RaceBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudRace(string race, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateRaceRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Race = race,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateRace(), "a Race", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Relation Type ======

        public async Task<JsonResult> OnPostRelationTypeList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse relationTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRelationTypeList(), "a RelationType List", "", requestData);

                if (relationTypes == null || relationTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading RelationType List",
                        success = false,
                        data = new List<RelationTypeBaseResponse>()
                    });
                }

                if (relationTypes.Success && relationTypes.Data != null)
                {
                    List<RelationTypeBaseResponse> result = JsonConvert.DeserializeObject<List<RelationTypeBaseResponse>>(relationTypes.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "RelationType List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = relationTypes.Message,
                        success = false,
                        data = new List<RelationTypeBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<RelationTypeBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudRelationType(string relationType, int action, int id)
        {
            try
            {
                var createRequest = new CreateRelationTypeRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    RelationType = relationType,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateRelationType(), "a RelationType", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Role Type ======

        public async Task<JsonResult> OnPostRoleTypeList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse roleTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetRoleTypeList(), "a RoleType List", "", requestData);

                if (roleTypes == null || roleTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading RoleType List",
                        success = false,
                        data = new List<RoleTypeBaseResponse>()
                    });
                }

                if (roleTypes.Success && roleTypes.Data != null)
                {
                    List<RoleTypeBaseResponse> result = JsonConvert.DeserializeObject<List<RoleTypeBaseResponse>>(roleTypes.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "RoleType List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = roleTypes.Message,
                        success = false,
                        data = new List<RoleTypeBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<RoleTypeBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudRoleType(string roleType, int action, int id)
        {
            try
            {
                var createRequest = new CreateRoleTypeRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    RoleTypeName = roleType,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    RoleTypeId = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateRoleType(), "a RoleType", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Sponsor Type ======

        public async Task<JsonResult> OnPostSponsorTypeList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse sponsorTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetSponsorTypeList(), "a SponsorType List", "", requestData);

                if (sponsorTypes == null || sponsorTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading SponsorType List",
                        success = false,
                        data = new List<SponsorTypeBaseResponse>()
                    });
                }

                if (sponsorTypes.Success && sponsorTypes.Data != null)
                {
                    List<SponsorTypeBaseResponse> result = JsonConvert.DeserializeObject<List<SponsorTypeBaseResponse>>(sponsorTypes.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "SponsorType List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = sponsorTypes.Message,
                        success = false,
                        data = new List<SponsorTypeBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<SponsorTypeBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudSponsorType(string sponsorType, int action, int id)
        {
            try
            {
                var createRequest = new CreateSponsorTypeRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    SponsorType = sponsorType,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateSponsorType(), "a SponsorType", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Task ======

        public async Task<JsonResult> OnPostTaskList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse tasks = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetTaskList(), "a Task", "", requestData);

                if (tasks == null || tasks.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Task List",
                        success = false,
                        data = new List<TaskBaseResponse>()
                    });
                }

                if (tasks.Success && tasks.Data != null)
                {
                    List<TaskBaseResponse> result = JsonConvert.DeserializeObject<List<TaskBaseResponse>>(tasks.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Task List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = tasks.Message,
                        success = false,
                        data = new List<TaskBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<TaskBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudTask(string taskName, int action, int id, int taskTypeId)
        {
            try
            {
                var createRequest = new CreateTaskRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    TaskName = taskName,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    TaskId = id,
                    TaskTypeId = taskTypeId,
                };
                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateTask(), "a Task", "", createRequest);
                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Task Type ======

        public async Task<JsonResult> OnPostTaskTypeList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse taskTypes = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetTaskTypeList(), "a TaskType List", "", requestData);

                if (taskTypes == null || taskTypes.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading TaskType List",
                        success = false,
                        data = new List<TaskTypeBaseResponse>()
                    });
                }

                if (taskTypes.Success && taskTypes.Data != null)
                {
                    List<TaskTypeBaseResponse> result = JsonConvert.DeserializeObject<List<TaskTypeBaseResponse>>(taskTypes.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "TaskType List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = taskTypes.Message,
                        success = false,
                        data = new List<TaskTypeBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<TaskTypeBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudTaskType(string taskType, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateTaskTypeRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    TaskTypeName = taskType,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    TaskTypeId = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateTaskType(), "a TaskType", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== Site ======

        public async Task<JsonResult> OnPostSiteList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse sites = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetSiteList(), "a Site List", "", requestData);

                if (sites == null || sites.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Site List",
                        success = false,
                        data = new List<SiteBaseResponse>()
                    });
                }

                if (sites.Success && sites.Data != null)
                {
                    List<SiteBaseResponse> result = JsonConvert.DeserializeObject<List<SiteBaseResponse>>(sites.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Site List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = sites.Message,
                        success = false,
                        data = new List<SiteBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<SiteBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudSite(string siteName, string? SiteAddress, string? siteContact, 
            string? sitePhone, string? siteEmail, string? siteCode, int action, int siteId)
        {
            try
            {
                var createRequest = new CreateSiteRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    SiteName = siteName,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    SiteId = siteId,
                    SiteAddress = SiteAddress ?? "",
                    SiteContact = siteContact ?? "",
                    SitePhone = sitePhone ?? "",
                    SiteEmail = siteEmail ?? "",
                    SiteCode = siteCode ?? ""
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateSite(), "a Site", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        #endregion

        #region ====== CRO ======

        public async Task<JsonResult> OnPostCROList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse cro = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetCROList(), "a CRO List", "", requestData);

                if (cro == null || cro.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Contract research List",
                        success = false,
                        data = new List<CROBaseResponse>()
                    });
                }

                if (cro.Success && cro.Data != null)
                {
                    List<CROBaseResponse> result = JsonConvert.DeserializeObject<List<CROBaseResponse>>(cro.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Contract research list was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = cro.Message,
                        success = false,
                        data = new List<CROBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<CROBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudCRO(string cro, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateCRORequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    CRO = cro,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateCRO(), "a CRO", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        public async Task<JsonResult> OnPostCRODropList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse cro = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetCRODropList(), "a CRO List", "", requestData);

                if (cro == null || cro.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Contract research List",
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }

                if (cro.Success && cro.Data != null)
                {
                    List<DropListBaseResponse> result = JsonConvert.DeserializeObject<List<DropListBaseResponse>>(cro.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Contract research list was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = cro.Message,
                        success = false,
                        data = new List<DropListBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<DropListBaseResponse>()
                });
            }

        }

        #endregion

        #region ====== VLTStatus ======

        public async Task<JsonResult> OnPostVLTStatusList()
        {
            try
            {

                var requestData = new GeneralRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                };

                BaseResponse name = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetVLTStatusList(), "a VLTStatus List", "", requestData);

                if (name == null || name.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Contract research List",
                        success = false,
                        data = new List<VLTStatusBaseResponse>()
                    });
                }

                if (name.Success && name.Data != null)
                {
                    List<VLTStatusBaseResponse> result = JsonConvert.DeserializeObject<List<VLTStatusBaseResponse>>(name.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Volunteer status list was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = name.Message,
                        success = false,
                        data = new List<VLTStatusBaseResponse>()
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    errorCode = 500,
                    errorMessage = ex.Message,
                    success = false,
                    data = new List<VLTStatusBaseResponse>()
                });
            }

        }

        public async Task<JsonResult> OnPostCrudVLTStatus(string name, string? comment, int action, int id)
        {
            try
            {
                var createRequest = new CreateVLTStatusRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    Name = name,
                    Comment = comment,
                    Username = 1, // Assuming a default user name for the system
                    Action = action,
                    Id = id
                };

                var response = await GenericAPI.CreateGeneric(_settings.ApiUrl(), _settings.Endpoint_CreateVLTStatus(), "a VLTStatus", "", createRequest);

                return new JsonResult(new
                {
                    success = response.Success,
                    message = response.Message,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        

        #endregion

    }
}
