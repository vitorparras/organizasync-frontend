import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import type {
  Appointment,
  AppointmentFilters,
} from '@core/domain/scheduling/models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appointments`;

  getAppointments(filters?: AppointmentFilters): Observable<Appointment[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.patientId) params = params.set('patientId', filters.patientId);
      if (filters.doctorId) params = params.set('doctorId', filters.doctorId);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http
      .get<Appointment[]>(this.apiUrl, { params })
      .pipe(map(appointments => this.mapAppointmentDates(appointments)));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http
      .get<Appointment>(`${this.apiUrl}/${id}`)
      .pipe(map(appointment => this.mapAppointmentDates([appointment])[0]));
  }

  createAppointment(
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Appointment> {
    return this.http
      .post<Appointment>(this.apiUrl, appointment)
      .pipe(map(appointment => this.mapAppointmentDates([appointment])[0]));
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http
      .put<Appointment>(`${this.apiUrl}/${id}`, appointment)
      .pipe(map(appointment => this.mapAppointmentDates([appointment])[0]));
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapAppointmentDates(appointments: Appointment[]): Appointment[] {
    return appointments.map(appointment => ({
      ...appointment,
      startTime: new Date(appointment.startTime),
      endTime: new Date(appointment.endTime),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    }));
  }
}
