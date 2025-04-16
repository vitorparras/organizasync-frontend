import { Component, type OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '@core/application/scheduling/appointment.service';
import { PatientService } from '@core/application/patients/patient.service';
import { TranslationService } from '@shared/i18n/translation.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { AppointmentStatus } from '@core/domain/scheduling/models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>
          {{
            isEditMode
              ? translate('scheduling.editAppointment')
              : translate('scheduling.newAppointment')
          }}
        </h1>
      </div>

      @if (appointmentService.loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ translate('common.loading') }}</p>
        </div>
      } @else {
        <div class="form-container">
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="appointment-form">
            <div class="form-group">
              <label for="patientId" class="form-label">
                {{ translate('scheduling.patient') }}
                <span class="required-indicator">*</span>
              </label>
              <select id="patientId" formControlName="patientId" class="select-input">
                <option value="">{{ translate('scheduling.selectPatient') }}</option>
                @for (patient of patientService.patients(); track patient.id) {
                  <option [value]="patient.id">{{ patient.name }}</option>
                }
              </select>
              @if (isFieldInvalid('patientId')) {
                <div class="form-error">
                  {{ translate('scheduling.patientRequired') }}
                </div>
              }
            </div>

            <div class="form-group">
              <label for="doctorId" class="form-label">
                {{ translate('scheduling.doctor') }}
                <span class="required-indicator">*</span>
              </label>
              <select id="doctorId" formControlName="doctorId" class="select-input">
                <option value="">{{ translate('scheduling.selectDoctor') }}</option>
                <option value="doctor1">Dr. João Silva</option>
                <option value="doctor2">Dra. Maria Santos</option>
                <option value="doctor3">Dr. Carlos Oliveira</option>
              </select>
              @if (isFieldInvalid('doctorId')) {
                <div class="form-error">
                  {{ translate('scheduling.doctorRequired') }}
                </div>
              }
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startTime" class="form-label">
                  {{ translate('scheduling.startTime') }}
                  <span class="required-indicator">*</span>
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  formControlName="startTime"
                  class="form-input"
                />
                @if (isFieldInvalid('startTime')) {
                  <div class="form-error">
                    {{ translate('scheduling.startTimeRequired') }}
                  </div>
                }
              </div>

              <div class="form-group">
                <label for="endTime" class="form-label">
                  {{ translate('scheduling.endTime') }}
                  <span class="required-indicator">*</span>
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  formControlName="endTime"
                  class="form-input"
                />
                @if (isFieldInvalid('endTime')) {
                  <div class="form-error">
                    {{ translate('scheduling.endTimeRequired') }}
                  </div>
                }
              </div>
            </div>

            @if (isEditMode) {
              <div class="form-group">
                <label for="status" class="form-label">
                  {{ translate('scheduling.status') }}
                  <span class="required-indicator">*</span>
                </label>
                <select id="status" formControlName="status" class="select-input">
                  <option value="scheduled">
                    {{ translate('scheduling.statuses.scheduled') }}
                  </option>
                  <option value="confirmed">
                    {{ translate('scheduling.statuses.confirmed') }}
                  </option>
                  <option value="completed">
                    {{ translate('scheduling.statuses.completed') }}
                  </option>
                  <option value="cancelled">
                    {{ translate('scheduling.statuses.cancelled') }}
                  </option>
                </select>
              </div>
            }

            <div class="form-group">
              <label for="notes" class="form-label">
                {{ translate('scheduling.notes') }}
              </label>
              <textarea
                id="notes"
                formControlName="notes"
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-actions">
              <app-button variant="outline" type="button" [routerLink]="['/scheduling']">
                {{ translate('common.cancel') }}
              </app-button>

              <app-button
                type="submit"
                [loading]="isSubmitting"
                [disabled]="appointmentForm.invalid || isSubmitting"
              >
                {{ translate('common.save') }}
              </app-button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent implements OnInit {
  protected appointmentService = inject(AppointmentService);
  protected patientService = inject(PatientService);
  private translationService = inject(TranslationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected appointmentForm = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    status: [AppointmentStatus.Scheduled],
    notes: [''],
  });

  protected isEditMode = false;
  protected appointmentId = '';
  protected isSubmitting = false;

  ngOnInit(): void {
    this.patientService.loadPatients();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appointmentId = params['id'];
        this.loadAppointment();
      }
    });
  }

  private loadAppointment(): void {
    this.appointmentService.loadAppointmentById(this.appointmentId);

    // Inscrever-se para atualizar o formulário quando o agendamento for carregado
    const subscription = this.appointmentService.selectedAppointment.subscribe(appointment => {
      if (appointment) {
        this.appointmentForm.patchValue({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          startTime: this.formatDateForInput(appointment.startTime),
          endTime: this.formatDateForInput(appointment.endTime),
          status: appointment.status,
          notes: appointment.notes || '',
        });

        subscription.unsubscribe();
      }
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.appointmentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected onSubmit(): void {
    if (this.appointmentForm.invalid) {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.appointmentForm.controls).forEach(key => {
        const control = this.appointmentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.appointmentForm.value;

    const appointment = {
      patientId: formValue.patientId!,
      doctorId: formValue.doctorId!,
      startTime: new Date(formValue.startTime!),
      endTime: new Date(formValue.endTime!),
      status: formValue.status as AppointmentStatus,
      notes: formValue.notes,
    };

    if (this.isEditMode) {
      this.appointmentService.updateAppointment(this.appointmentId, appointment).subscribe({
        next: () => {
          this.router.navigate(['/scheduling']);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.router.navigate(['/scheduling']);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  protected translate(key: string): string {
    return this.translationService.translate(key);
  }
}
