export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  userId: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: string[];
}
