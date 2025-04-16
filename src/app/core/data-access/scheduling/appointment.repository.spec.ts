import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentRepository } from './appointment.repository';
import { environment } from '@environments/environment';
import {
  type Appointment,
  AppointmentStatus,
} from '@core/domain/scheduling/models/appointment.model';

describe('AppointmentRepository', () => {
  let repository: AppointmentRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentRepository],
    });

    repository = TestBed.inject(AppointmentRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should get appointments', () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        startTime: new Date(),
        endTime: new Date(),
        status: AppointmentStatus.Scheduled,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repository.getAppointments().subscribe(appointments => {
      expect(appointments).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments);
  });

  it('should get appointment by id', () => {
    const mockAppointment: Appointment = {
      id: '1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      startTime: new Date(),
      endTime: new Date(),
      status: AppointmentStatus.Scheduled,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repository.getAppointmentById('1').subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/appointments/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointment);
  });

  it('should create appointment', () => {
    const newAppointment = {
      patientId: 'patient1',
      doctorId: 'doctor1',
      startTime: new Date(),
      endTime: new Date(),
      status: AppointmentStatus.Scheduled,
    };

    const mockResponse: Appointment = {
      ...newAppointment,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repository.createAppointment(newAppointment).subscribe(appointment => {
      expect(appointment).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/appointments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAppointment);
    req.flush(mockResponse);
  });

  it('should update appointment', () => {
    const updateData = {
      status: AppointmentStatus.Confirmed,
    };

    const mockResponse: Appointment = {
      id: '1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      startTime: new Date(),
      endTime: new Date(),
      status: AppointmentStatus.Confirmed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repository.updateAppointment('1', updateData).subscribe(appointment => {
      expect(appointment).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/appointments/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete appointment', () => {
    repository.deleteAppointment('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/appointments/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(undefined);
  });
});
