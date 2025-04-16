import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from '@core/data-access/scheduling/appointment.repository';
import { ToastService } from '@shared/ui/toast/toast.service';
import {
  type Appointment,
  AppointmentStatus,
} from '@core/domain/scheduling/models/appointment.model';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repositoryMock: jasmine.SpyObj<AppointmentRepository>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

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

  beforeEach(() => {
    repositoryMock = jasmine.createSpyObj('AppointmentRepository', [
      'getAppointments',
      'getAppointmentById',
      'createAppointment',
      'updateAppointment',
      'deleteAppointment',
    ]);

    toastServiceMock = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        { provide: AppointmentRepository, useValue: repositoryMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });

    service = TestBed.inject(AppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load appointments', () => {
    repositoryMock.getAppointments.and.returnValue(of(mockAppointments));

    service.loadAppointments();

    expect(repositoryMock.getAppointments).toHaveBeenCalled();
    expect(service.appointments()).toEqual(mockAppointments);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('should handle error when loading appointments', () => {
    const errorMessage = 'Error loading appointments';
    repositoryMock.getAppointments.and.returnValue(throwError(() => new Error(errorMessage)));

    service.loadAppointments();

    expect(repositoryMock.getAppointments).toHaveBeenCalled();
    expect(service.appointments()).toEqual([]);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toContain(errorMessage);
  });

  it('should load appointment by id', () => {
    const mockAppointment = mockAppointments[0];
    repositoryMock.getAppointmentById.and.returnValue(of(mockAppointment));

    service.loadAppointmentById('1');

    expect(repositoryMock.getAppointmentById).toHaveBeenCalledWith('1');
    expect(service.selectedAppointment()).toEqual(mockAppointment);
    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  it('should create appointment', () => {
    const newAppointment = {
      patientId: 'patient1',
      doctorId: 'doctor1',
      startTime: new Date(),
      endTime: new Date(),
      status: AppointmentStatus.Scheduled,
    };

    const mockResponse = {
      ...newAppointment,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repositoryMock.createAppointment.and.returnValue(of(mockResponse));

    service.createAppointment(newAppointment).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    expect(repositoryMock.createAppointment).toHaveBeenCalledWith(newAppointment);
    expect(toastServiceMock.show).toHaveBeenCalled();
  });

  it('should update appointment', () => {
    const updateData = { status: AppointmentStatus.Confirmed };
    const mockResponse = { ...mockAppointments[0], ...updateData };

    repositoryMock.updateAppointment.and.returnValue(of(mockResponse));

    service.updateAppointment('1', updateData).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    expect(repositoryMock.updateAppointment).toHaveBeenCalledWith('1', updateData);
    expect(toastServiceMock.show).toHaveBeenCalled();
  });

  it('should delete appointment', () => {
    repositoryMock.deleteAppointment.and.returnValue(of(void 0));

    service.deleteAppointment('1').subscribe(result => {
      expect(result).toBeTrue();
    });

    expect(repositoryMock.deleteAppointment).toHaveBeenCalledWith('1');
    expect(toastServiceMock.show).toHaveBeenCalled();
  });
});
