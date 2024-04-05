import { useState, useEffect } from "react";
import axios from "axios";

// axios 인스턴스 생성 및 기본 URL 설정
const apiClient = axios.create({
  baseURL: "baseURL",
});

const useApi = (method, url, data = {}, params = {}, headers = {}) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          params,
          headers,
        };

        let response;

        switch (method.toLowerCase()) {
          case "get":
            response = await apiClient.get(url, config);
            break;
          case "post":
            response = await apiClient.post(url, data, config);
            break;
          case "put":
            response = await apiClient.put(url, data, config);
            break;
          case "patch":
            response = await apiClient.patch(url, data, config);
            break;
          case "delete":
            response = await apiClient.delete(url, config);
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
    };

    fetchData();
  }, [method, url, data, params, headers]);

  return { response, loading, error };
};

export default useApi;
