using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.STD;
using GMS_UI.Helper;
using GMS_UI.Models.Enum;
using GMS_UI.Models.STD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.STD.StudioListData
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostStudioList()
        {
            try
            {

                var requestData = new StudioRequest
                {
                    CompanyId = 1, // Replace with actual company ID
                    SiteId = 1 // Replace with actual site ID
                };

                BaseResponse studies = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetStudioList(), "a StudioListData List", "", requestData);

                if (studies == null || studies.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Studio List",
                        success = false,
                        data = new List<StudioListResponse>()
                    });
                }

                if (studies.Success && studies.Data != null)
                {
                    List<StudioListResponse>? response = JsonConvert.DeserializeObject<List<StudioListResponse>>(studies.Data.ToString());

                    if (response == null)
                    {
                        return new JsonResult(new
                        {
                            errorCode = 500,
                            errorMessage = "Error deserializing Studio List data",
                            success = false,
                            data = new List<StudioListResponse>()
                        });
                    }

                    List<StudioListViewModel> result = [.. response.Select(st => new StudioListViewModel {
                        CompanyId = st.CompanyId,
                        Code = st.Code,
                        Description = st.Description,
                        EndDate = st.EndDate,
                        Goal = st.Goal,
                        Id = st.Id,
                        Indication = st.Indication,
                        LastUpdatedAt = st.LastUpdatedAt,
                        Name = st.Name,
                        Notes = st.Notes,
                        Phase = st.Phase,
                        ProtocolId = st.ProtocolId,
                        ProtocolName = st.ProtocolName,
                        RandomizationType = st.RandomizationType,
                        SiteId = st.SiteId,
                        SiteName = st.SiteName,
                        SponsorId = st.SponsorId,
                        ActionDateTime = st.ActionDateTime,
                        StartDate = st.StartDate,
                        StudioStatus = st.StudioStatus,
                        TherapeuticArea = st.TherapeuticArea,
                        UserName = st.UserName,
                        DateCreated = st.DateCreated,
                        Active = st.Active,
                        BlindType = st.BlindType,
                        SponsorName = st.SponsorName,
                        StudioStatusName = ((StudyStatusEnum)st.StudioStatus).ToString(),
                    })];

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Studies List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = studies.Message,
                        success = false,
                        data = new List<StudioListResponse>()
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
                    data = new List<StudioListResponse>()
                });
            }

        }


    }
}
