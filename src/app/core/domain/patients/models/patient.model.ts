export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address?: Address;
  healthInsurance?: string;
  medicalRecordNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  PreferNotToSay = 'prefer_not_to_say',
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PatientFilters {
  name?: string;
  email?: string;
  healthInsurance?: string;
}
