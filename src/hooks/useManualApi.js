import { useState, useCallback } from "react";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.0.67:8080/",
});

const useManualApi = (method, url, data = {}, params = {}, headers = {}) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (requestData, requestParams, requestHeaders) => {
      setLoading(true);
      setError(null);
      try {
        const config = {
          params: requestParams,
          headers: requestHeaders,
        };

        let response;
        switch (method.toLowerCase()) {
          //post,put,patch,delete추가 가능
          case "get":
            response = await apiClient.get(url, config);
            break;
          case "post":
            response = await apiClient.post(url, requestData, config);
            break;
          default:
            throw new Error(`The HTTP method ${method} is not supported.`);
        }
        setResponse(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [method, url]
  );

  //fetchData 호출
  const execute = useCallback(
    (requestData = data, requestParams = params, requestHeaders = headers) => {
      fetchData(requestData, requestParams, requestHeaders);
    },
    [fetchData, data, params, headers]
  );

  return { response, loading, error, execute };
};

export default useManualApi;
