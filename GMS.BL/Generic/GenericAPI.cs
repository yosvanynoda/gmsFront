using GMS.Objects.API;
using Newtonsoft.Json;
using RestSharp;

namespace GMS.BL.Generic
{
    public class GenericAPI
    {
        //public static async Task<BaseResponse> CreateGeneric(string apiURL, string endpoint, string catalog, string token, CreateCompanyRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new(endpoint);

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            result.Success = true;
        //            result.Message = response.Content ?? $"{catalog} was created successfully.";
        //            result.StatusCode = 200;
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? $"An error occurred while creating a {catalog}.";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while creating a {catalog}. {ex.Message}";
        //    }

        //    return result;
        //}

        public static async Task<BaseResponse> CreateGeneric(string apiURL, string endpoint, string catalog, string token, object requestData)
        {
            BaseResponse result = new();

            try
            {
                RestClientOptions options = new(apiURL)
                {
                    //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
                };

                RestClient client = new(options);

                RestRequest request = new(endpoint);

                _ = request.AddJsonBody(requestData);

                RestResponse response = await client.ExecutePostAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    BaseResponse? data = JsonConvert.DeserializeObject<BaseResponse>(response.Content ?? string.Empty);

                    result.Success = true;
                    result.Message = response.Content ?? $"{catalog} was created successfully.";
                    result.StatusCode = 200;
                    result.Data = data?.Data;
                }
                else
                {
                    result.Success = false;
                    result.StatusCode = 500;
                    result.Message = response.Content ?? $"An error occurred while creating a {catalog}.";
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.StatusCode = 500;
                result.Message = $"An error occurred while creating a {catalog}. {ex.Message}";
            }

            return result;
        }

        public static async Task<BaseResponse> GetGeneric(string apiURL, string endpoint, string catalog, string token, object requestData)
        {
            BaseResponse result = new();

            try
            {
                RestClientOptions options = new(apiURL)
                {
                    //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
                };

                RestClient client = new(options);

                RestRequest request = new(endpoint);

                _ = request.AddJsonBody(requestData);

                RestResponse response = await client.ExecutePostAsync(request);

                if (response.IsSuccessStatusCode && !string.IsNullOrWhiteSpace(response.Content))
                {
                    result = JsonConvert.DeserializeObject<BaseResponse>(response.Content) ?? new BaseResponse();
                }
                else
                {
                    result.Success = false;
                    result.Data = null;
                    result.StatusCode = 500;
                    result.Message = response.Content ?? $"An error occurred while reading {catalog}.";
                }

            }
            catch (Exception ex)
            {
                result.Success = false;
                result.StatusCode = 500;
                result.Message = $"An error occurred while reading {catalog}. {ex.Message}";
                result.Data = null;
            }

            return result;
        }

        // Generic version with strongly-typed Data property
        public static async Task<BaseResponse<T>> GetGeneric<T>(string apiURL, string endpoint, string catalog, string token, object requestData)
        {
            BaseResponse<T> result = new();

            try
            {
                RestClientOptions options = new(apiURL)
                {
                    //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
                };

                RestClient client = new(options);

                RestRequest request = new(endpoint);

                _ = request.AddJsonBody(requestData);

                RestResponse response = await client.ExecutePostAsync(request);

                if (response.IsSuccessStatusCode && !string.IsNullOrWhiteSpace(response.Content))
                {
                    result = JsonConvert.DeserializeObject<BaseResponse<T>>(response.Content) ?? new BaseResponse<T>();
                }
                else
                {
                    result.Success = false;
                    result.Data = default;
                    result.StatusCode = 500;
                    result.Message = response.Content ?? $"An error occurred while reading {catalog}.";
                }

            }
            catch (Exception ex)
            {
                result.Success = false;
                result.StatusCode = 500;
                result.Message = $"An error occurred while reading {catalog}. {ex.Message}";
                result.Data = default;
            }

            return result;
        }

        //public static async Task<BaseResponse> GetGeneric(string apiURL, string endpoint, string catalog, string token, GeneralCompanySiteRequest requestData)
        //{
        //    BaseResponse result = new();

        //    try
        //    {
        //        RestClientOptions options = new(apiURL)
        //        {
        //            //Authenticator = new JwtAuthenticator(token) comment for now not security implemented yet
        //        };

        //        RestClient client = new(options);

        //        RestRequest request = new(endpoint);

        //        _ = request.AddJsonBody(requestData);

        //        RestResponse response = await client.ExecutePostAsync(request);

        //        if (response.IsSuccessStatusCode && !string.IsNullOrWhiteSpace(response.Content))
        //        {
        //            result = JsonConvert.DeserializeObject<BaseResponse>(response.Content) ?? new BaseResponse();
        //        }
        //        else
        //        {
        //            result.Success = false;
        //            result.Data = null;
        //            result.StatusCode = 500;
        //            result.Message = response.Content ?? $"An error occurred while reading {catalog}.";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        result.Success = false;
        //        result.StatusCode = 500;
        //        result.Message = $"An error occurred while reading {catalog}. {ex.Message}";
        //        result.Data = null;
        //    }

        //    return result;
        //}
    }
}
