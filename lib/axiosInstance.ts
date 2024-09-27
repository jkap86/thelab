import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

export default axiosInstance;
