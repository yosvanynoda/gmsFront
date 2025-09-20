using GMS.Objects.API;
using GMS.Objects.SUB;
using RestSharp;

namespace GMS.BL.SUB
{
    public class SUBAPI
    {
        //public static async Task<BaseResponse> CreateContact(string apiURL, string token, CreateContactRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/sub/createcontact");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "Contact was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a Contact.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a Contact. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateRandomCode(string apiURL, string token, CreateRandomCodeRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/sub/createrandomcode");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "RandomCode was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a RandomCode.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a RandomCode. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateSubjectData(string apiURL, string token, CreateSubjectDataRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/sub/createsubjectdata");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "SubjectData was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a SubjectData.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a SubjectData. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateSubject(string apiURL, string token, CreateSubjectRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/sub/createsubject");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "Subject was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a Subject.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a Subject. {ex.Message}";
        //    }

        //    return result;
        //}
    }
}
