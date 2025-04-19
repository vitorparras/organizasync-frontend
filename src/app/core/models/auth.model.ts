export interface LoginCommand {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResultDto {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshTokenExpiryTime?: string;
  name: string;
  email: string;
}

export interface LogoutCommand {
  refreshToken: string;
}

export interface RefreshTokenCommand {
  refreshToken: string;
}