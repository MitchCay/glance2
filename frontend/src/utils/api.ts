import { useAuth } from "@clerk/clerk-react";

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = async (endpoint: string, options = {}) => {
    const token = await getToken();
    const defaultOptions = {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log(options);

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // TODO: handle custom error codes here
      throw new Error(errorData?.detail || "An error occurred");
    }

    return response;
  };

  return makeRequest;
};
