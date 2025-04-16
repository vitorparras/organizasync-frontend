import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentListComponent } from './appointment-list.component';
import { AppointmentService } from '@core/application/scheduling/appointment.service';
import { PatientService } from '@core/application/patients/patient.service';
import { TranslationService } from '@shared/i18n/translation.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { signal } from '@angular/core';
import {
  type Appointment,
  AppointmentStatus,
} from '@core/domain/scheduling/models/appointment.model';
import type { Patient } from '@core/domain/patients/models/patient.model';
import { of } from 'rxjs';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let appointmentServiceMock: jasmine.SpyObj<AppointmentService>;
  let patientServiceMock: jasmine.SpyObj<PatientService>;
  let translationServiceMock: jasmine.SpyObj<TranslationService>;
  let confirmSpy: jasmine.Spy<any>;

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

  const mockPatients: Patient[] = [
    {
      id: 'patient1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      birthDate: new Date(),
      gender: 'male' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    appointmentServiceMock = jasmine.createSpyObj(
      'AppointmentService',
      ['loadAppointments', 'deleteAppointment'],
      {
        appointments: signal(mockAppointments).asReadonly(),
        loading: signal(false).asReadonly(),
        error: signal(null).asReadonly(),
      }
    );

    patientServiceMock = jasmine.createSpyObj('PatientService', ['loadPatients'], {
      patients: signal(mockPatients).asReadonly(),
    });

    translationServiceMock = jasmine.createSpyObj(
      'TranslationService',
      ['translate', 'currentLanguage'],
      {
        currentLanguage: signal('pt').asReadonly(),
      }
    );

    translationServiceMock.translate.and.callFake((key: string) => key);
    translationServiceMock.currentLanguage.and.returnValue('pt');
    appointmentServiceMock.deleteAppointment.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        AppointmentListComponent,
        ButtonComponent,
        InputComponent,
      ],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceMock },
        { provide: PatientService, useValue: patientServiceMock },
        { provide: TranslationService, useValue: translationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointments and patients on init', () => {
    expect(appointmentServiceMock.loadAppointments).toHaveBeenCalled();
    expect(patientServiceMock.loadPatients).toHaveBeenCalled();
  });

  it('should display appointments in the table', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(1);
  });

  it('should get patient name by id', () => {
    const patientName = component['getPatientName']('patient1');
    expect(patientName).toBe('John Doe');
  });

  it('should confirm and delete appointment', () => {
    confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

    component['confirmDelete']('1');

    expect(window.confirm).toHaveBeenCalled();
    expect(appointmentServiceMock.deleteAppointment).toHaveBeenCalledWith('1');
  });

  it('should not delete appointment if not confirmed', () => {
    confirmSpy = spyOn(window, 'confirm').and.returnValue(false);

    component['confirmDelete']('1');

    expect(window.confirm).toHaveBeenCalled();
    expect(appointmentServiceMock.deleteAppointment).not.toHaveBeenCalled();
  });

  it('should apply filters when filter button is clicked', () => {
    component.filterForm.patchValue({
      status: AppointmentStatus.Scheduled,
    });

    component['applyFilters']();

    expect(appointmentServiceMock.loadAppointments).toHaveBeenCalledWith({
      status: AppointmentStatus.Scheduled,
    });
  });
});
