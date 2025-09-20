using GMS.Objects.API;
using GMS.Objects.PRJ;
using RestSharp;

namespace GMS.BL.PRJ
{
    public class PRJAPI
    {
        //public static async Task<BaseResponse> CreateStudioSubject(string apiURL, string token, CreateStudioSubjectRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/prj/createstudiosubject");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "StudioSubject was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a StudioSubject.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a StudioSubject. {ex.Message}";
        //    }

        //    return result;
        //}
    }
}
