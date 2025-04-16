import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import type { Patient, PatientFilters } from '@core/domain/patients/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;

  getPatients(filters?: PatientFilters): Observable<Patient[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.healthInsurance) params = params.set('healthInsurance', filters.healthInsurance);
    }

    return this.http
      .get<Patient[]>(this.apiUrl, { params })
      .pipe(map(patients => this.mapPatientDates(patients)));
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http
      .get<Patient>(`${this.apiUrl}/${id}`)
      .pipe(map(patient => this.mapPatientDates([patient])[0]));
  }

  createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Observable<Patient> {
    return this.http
      .post<Patient>(this.apiUrl, patient)
      .pipe(map(patient => this.mapPatientDates([patient])[0]));
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http
      .put<Patient>(`${this.apiUrl}/${id}`, patient)
      .pipe(map(patient => this.mapPatientDates([patient])[0]));
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapPatientDates(patients: Patient[]): Patient[] {
    return patients.map(patient => ({
      ...patient,
      birthDate: new Date(patient.birthDate),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    }));
  }
}
