using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using Newtonsoft.Json;
using RestSharp;

namespace GMS.BL.STD
{
    public class STDAPI
    {
        //public static async Task<BaseResponse> CreateMonitor(string apiURL, string token, CreateMonitorRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/createmonitor");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "Monitor was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a Monitor.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a Monitor. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateProtocol(string apiURL, string token, CreateProtocolRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/createprotocol");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "Protocol was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a Protocol.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a Protocol. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateSponsor(string apiURL, string token, CreateSponsorRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/createsponsor");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "Sponsor was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a Sponsor.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a Sponsor. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateStudioData(string apiURL, string token, CreateStudioDataRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/createstudiodata");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "StudioData was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a StudioData.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a StudioData. {ex.Message}";
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> CreateStudioDoc(string apiURL, string token, CreateStudioDocRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/createstudiodoc");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? "StudioDoc was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while creating a StudioDoc.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a StudioDoc. {ex.Message}";
        //    }

        //    return result;
        //}

        

        //public static async Task<BaseResponse> GetProtocolList(string apiURL, string token, GeneralRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/getprotocollist");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Data = response.Content;
        //            result.Message = response.Content ?? "Protoco lList was read successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.Data = null;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while reading a Protoco lList.";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while reading a Protoco lList. {ex.Message}";
        //        result.Data = null;
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> GetSponsorList(string apiURL, string token, GeneralRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/getsponsorlist");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Data = response.Content;
        //            result.Message = response.Content ?? "Sponsor List was read successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.Data = null;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while reading a Sponsor List.";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while reading a Sponsor List. {ex.Message}";
        //        result.Data = null;
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> GetStudioList(string apiURL, string token, GeneralRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/getstudiolist");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Data = response.Content;
        //            result.Message = response.Content ?? "Studio List was read successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.Data = null;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while reading a Studio List.";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while reading a Studio List. {ex.Message}";
        //        result.Data = null;
        //    }

        //    return result;
        //}

        //public static async Task<BaseResponse> GetSubjectList(string apiURL, string token, GeneralRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new("api/v1/std/getsubjectlist");

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Data = response.Content;
        //            result.Message = response.Content ?? "Subject List was read successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.Data = null;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? "An error occurred while reading a Subject List.";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while reading a Subject List. {ex.Message}";
        //        result.Data = null;
        //    }

        //    return result;
        //}


    }
}
