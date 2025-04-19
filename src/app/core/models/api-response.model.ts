export interface GenericResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type LoginResultDtoGenericResponse = GenericResponse<{
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}>;