import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { host } from "./apiRouter";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { refreshTokenService } from "../services/authService";
import { UseCheckExpirationToken } from "../hooks/authHook";
import { IDecodedToken } from "../commom/type";
import { logOutService } from "../services/authService";
import { store } from "../store/index";

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: IDecodedToken = jwtDecode(token);
        if (!decoded.exp) return true; // Nếu không có exp, coi như hết hạn
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error("❌ Lỗi khi decode token:", error);
        return true;
    }
};

const handleLogout = async () => {
    console.warn("⚠️ Refresh token hết hạn hoặc không hợp lệ. Đăng xuất...");
    localStorage.removeItem('token');
    await logOutService()
    window.location.href = '/login';
};

class HttpClient {
    instance: AxiosInstance;
    isRefreshing: boolean = false;  // Biến kiểm tra xem có đang refresh token không
    failedQueue: any[] = []; // Mảng lưu các request bị lỗi chờ refresh token

    constructor() {
        this.instance = axios.create({
            baseURL: `${host}`,
            withCredentials: true,
            timeout: 5000,
        });
        this.setupInterceptors();
    }

    private setupInterceptors(): void {

        // phương thức này đăng gắn token vào header.
        // Nhưng máy chủ của tôi đã tự gắn token vào cookie nên không cần cái này.
        //Mã này để ở đây để tham khảo.
        // this.instance.interceptors.request.use(
        //     (config: InternalAxiosRequestConfig) => {
        //         const token = localStorage.getItem('token');
        //         if (token) {
        //             config.headers['Authorization'] = `Bearer ${token}`;
        //         }
        //         return config;
        //     },
        //     (error) => {
        //         return Promise.reject(error);
        //     }
        // );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const originalRequest = error.config;

                if (!originalRequest || error.response?.status !== 401) {
                    return Promise.reject(error);
                }

                if (originalRequest.url?.includes("/auth/login")) {
                    return Promise.reject(error);
                }

                const token = localStorage.getItem('token');
                const isTokenExpiredFlag = token ? isTokenExpired(token) : true;

                // Kiểm tra nếu request hiện tại là refresh token → Không xử lý tiếp, đăng xuất
                if (originalRequest.url?.includes("/auth/refresh")) {
                    const isLogin = store.getState().auth.isAuth
                    if (isLogin) {
                        handleLogout();
                        return Promise.reject(error);
                    }
                }

                // Nếu token đã hết hạn, thử refresh token
                if (isTokenExpiredFlag && !originalRequest._retry) {
                    originalRequest._retry = true;

                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then(() => this.instance(originalRequest))
                            .catch((err) => Promise.reject(err));
                    }

                    this.isRefreshing = true;

                    try {
                        const res = await refreshTokenService();
                        if (res && res.data.token) {
                            const newToken = res.data.token;
                            localStorage.setItem('token', newToken);

                            // Xử lý lại các request bị chặn
                            this.failedQueue.forEach((req) => req.resolve());
                            this.failedQueue = [];

                            return this.instance(originalRequest);
                        } else {
                            handleLogout();
                        }
                    } catch (refreshError) {
                        console.error("❌ Lỗi khi refresh token:", refreshError);
                        handleLogout();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}


const http = new HttpClient().instance;
export default http