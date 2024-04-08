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
          case "post":
            response = await apiClient.post(url, requestData, config);
            break;
          default:
            throw new Error(`The HTTP method ${method} is not supported.`);
        }
        setResponse(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [method, url]
  );

  // execute 함수는 fetchData를 호출하며, 필요한 매개변수를 전달합니다.
  const execute = useCallback(
    (requestData = data, requestParams = params, requestHeaders = headers) => {
      fetchData(requestData, requestParams, requestHeaders);
    },
    [fetchData, data, params, headers]
  );

  return { response, loading, error, execute };
};

export default useManualApi;
