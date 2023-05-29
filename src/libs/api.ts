import customAlert from "@/components/modal/CustomModalAlert";
import { useHandleLogout } from "@/hooks/user";
import { storageConstants } from "@/types";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import { getCookie } from "./cookie";
import { setAccessToken, setRefreshToken } from "@/hooks/user-storage";

export const instance = axios.create();

// Request interceptor
const interceptorRequestFulfilled = (config: AxiosRequestConfig) => {
  let TOKEN =
    typeof window !== "undefined"
      ? localStorage.getItem(storageConstants.accessToken)
      : "";
  if (TOKEN) {
    return {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      } as AxiosRequestHeaders,
    };
  } else {
    return {
      ...config,
      headers: {
        "Content-Type": "application/json",
      } as AxiosRequestHeaders,
    };
  }
};

instance.interceptors.request.use(interceptorRequestFulfilled);

// Response interceptor
const responseInterceptorFulfilled = (res: AxiosResponse) => {
  if (200 <= res.status && res.status < 300) return res;

  return Promise.reject(...res.data);
};

const responseInterceptorRejected = async (error: AxiosError | any) => {
  const {
    config,
    response: { status },
  } = error;

  const originalRequest = config;

  if (status === 403) {
    console.log("403에러");
    try {
      // const accessToken =
      //   typeof window !== "undefined"
      //     ? localStorage.getItem(storageConstants.accessToken)
      //     : "";
      const refreshToken =
        typeof window !== "undefined"
          ? getCookie(storageConstants.refreshToken)
          : "";
      const data = await axios
        .post(
          `/api/member/reissue`,
          {},
          {
            headers: {
              withCredentials: true,
              RefreshToken: refreshToken,
            },
          }
        )
        .then((res: any) => {
          return res.data;
        })
        .catch((err) => {
          customAlert("토큰이 만료되었습니다.");
          useHandleLogout();
        });
      const newAccessToken = data.tokens.accessToken as string;
      const newRefreshToken = data.tokens.refreshToken as string;

      originalRequest.headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + newAccessToken,
      };

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      return await axios(originalRequest);
    } catch (err) {
      new Error(error);
    }
  }
  return Promise.reject(error);
};
instance.interceptors.response.use(
  responseInterceptorFulfilled,
  responseInterceptorRejected
);

export function get<T>(...args: Parameters<typeof instance.get>) {
  return instance.get<T, T>(...args);
}

export function post<T>(...args: Parameters<typeof instance.post>) {
  return instance.post<T, T>(...args);
}

export function put<T>(...args: Parameters<typeof instance.put>) {
  return instance.put<T, T>(...args);
}

export function del<T>(...args: Parameters<typeof instance.delete>) {
  return instance.delete<T, T>(...args);
}
