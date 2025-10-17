using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.VLT;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace GMS_UI.Pages.VLT.Volunteer
{
    public class IndexModel(ILogger<IndexModel> logger, ISettings settings) : PageModel
    {
        private readonly ILogger<IndexModel> _logger = logger;

        private readonly ISettings _settings = settings;

        public async Task<JsonResult> OnPostAsync()
        {
            try
            {

                var requestData = new GeneralCompanySiteRequest
                {
                    CompanyId = 1, // Assuming CompanyId is always 1
                    SiteId = 1, // Assuming SiteId is always 1
                };

                BaseResponse volunteers = await GenericAPI.GetGeneric(_settings.ApiUrl(), _settings.Endpoint_GetVolunteerList(), "a Volunteer List", "", requestData);

                if (volunteers == null || volunteers.Data == null)
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = "Error reading Volunteer List",
                        success = false,
                        data = new List<VLTVolunteerList>()
                    });
                }

                if (volunteers.Success && volunteers.Data != null)
                {
                    List<VLTVolunteerList> result = JsonConvert.DeserializeObject<List<VLTVolunteerList>>(volunteers.Data.ToString());

                    return new JsonResult(new
                    {
                        errorCode = 200,
                        errorMessage = "Volunteer List was read successfully",
                        success = true,
                        data = result
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        errorCode = 500,
                        errorMessage = volunteers.Message,
                        success = false,
                        data = new List<VLTVolunteerList>()
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
                    data = new List<VLTVolunteerList>()
                });
            }

        }

        public async Task<JsonResult> OnPostGetHistoryAsync([FromBody] VolunteerRequest request)
        {
            try
            {
                _logger.LogInformation("OnPostGetHistoryAsync called for VolunteerId: {VolunteerId}", request.VolunteerId);

                var requestData = new VolunteerRequest
                {
                    CompanyId = 1,
                    SiteId = 1,
                    VolunteerId = request.VolunteerId
                };

                BaseResponse historyResponse = await GenericAPI.GetGeneric(_settings.ApiUrl(), "api/v1/VLT/getvolunteerhistory", "Volunteer History", "", requestData);

                if (historyResponse == null || historyResponse.Data == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Error reading Volunteer History"
                    });
                }

                if (historyResponse.Success && historyResponse.Data != null)
                {
                    // Deserialize to the correct type
                    VLTVolunteerHistoryResponse historyData = null;

                    if (historyResponse.Data != null)
                    {
                        var dataType = historyResponse.Data.GetType();
                        _logger.LogInformation("History Data type: {Type}", dataType.FullName);

                        // If Data is a string (JSON), deserialize it
                        if (dataType == typeof(string))
                        {
                            historyData = JsonConvert.DeserializeObject<VLTVolunteerHistoryResponse>(historyResponse.Data.ToString());
                        }
                        // If Data is JArray or JToken, convert to typed object
                        else if (dataType.FullName.StartsWith("Newtonsoft.Json.Linq"))
                        {
                            historyData = JsonConvert.DeserializeObject<VLTVolunteerHistoryResponse>(historyResponse.Data.ToString());
                        }
                        // If it's already the correct type
                        else if (dataType == typeof(VLTVolunteerHistoryResponse))
                        {
                            historyData = (VLTVolunteerHistoryResponse)historyResponse.Data;
                        }
                    }

                    return new JsonResult(new
                    {
                        success = true,
                        message = historyResponse.Message,
                        data = historyData
                    });
                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = historyResponse.Message ?? "Error reading Volunteer History"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in OnPostGetHistoryAsync: {Message}", ex.Message);
                return new JsonResult(new
                {
                    success = false,
                    message = $"Exception: {ex.Message}"
                });
            }
        }
    }
}
