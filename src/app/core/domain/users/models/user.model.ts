export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  plainPassword: string;
}

export interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  updatedBy: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
