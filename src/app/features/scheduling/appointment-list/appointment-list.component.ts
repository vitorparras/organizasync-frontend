import { Component, type OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '@core/application/scheduling/appointment.service';
import { PatientService } from '@core/application/patients/patient.service';
import { TranslationService } from '@shared/i18n/translation.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { AppointmentStatus } from '@core/domain/scheduling/models/appointment.model';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ translate('scheduling.title') }}</h1>
        <app-button [routerLink]="['/scheduling/new']">
          {{ translate('scheduling.newAppointment') }}
        </app-button>
      </div>

      <div class="filters">
        <form [formGroup]="filterForm" class="filter-form">
          <div class="filter-group">
            <app-input
              formControlName="search"
              [placeholder]="translate('common.search')"
              type="text"
            ></app-input>
          </div>

          <div class="filter-group">
            <select formControlName="status" class="select-input">
              <option value="">{{ translate('scheduling.allStatuses') }}</option>
              <option value="scheduled">{{ translate('scheduling.statuses.scheduled') }}</option>
              <option value="confirmed">{{ translate('scheduling.statuses.confirmed') }}</option>
              <option value="completed">{{ translate('scheduling.statuses.completed') }}</option>
              <option value="cancelled">{{ translate('scheduling.statuses.cancelled') }}</option>
            </select>
          </div>

          <app-button variant="outline" type="button" (buttonClick)="applyFilters()">
            {{ translate('common.filter') }}
          </app-button>
        </form>
      </div>

      @if (appointmentService.loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ translate('common.loading') }}</p>
        </div>
      } @else if (appointmentService.error()) {
        <div class="error-container">
          <p>{{ appointmentService.error() }}</p>
          <app-button variant="outline" (buttonClick)="loadAppointments()">
            {{ translate('common.tryAgain') }}
          </app-button>
        </div>
      } @else if (appointmentService.appointments().length === 0) {
        <div class="empty-container">
          <p>{{ translate('scheduling.noAppointments') }}</p>
        </div>
      } @else {
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ translate('scheduling.patient') }}</th>
                <th>{{ translate('scheduling.doctor') }}</th>
                <th>{{ translate('scheduling.startTime') }}</th>
                <th>{{ translate('scheduling.status') }}</th>
                <th>{{ translate('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (appointment of appointmentService.appointments(); track appointment.id) {
                <tr>
                  <td>{{ getPatientName(appointment.patientId) }}</td>
                  <td>{{ appointment.doctorId }}</td>
                  <td>{{ formatDate(appointment.startTime) }}</td>
                  <td>
                    <span class="status-badge" [class]="getStatusClass(appointment.status)">
                      {{ translate('scheduling.statuses.' + appointment.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <app-button
                        variant="ghost"
                        size="sm"
                        [routerLink]="['/scheduling', appointment.id]"
                      >
                        {{ translate('common.view') }}
                      </app-button>
                      <app-button
                        variant="ghost"
                        size="sm"
                        [routerLink]="['/scheduling', appointment.id, 'edit']"
                      >
                        {{ translate('common.edit') }}
                      </app-button>
                      <app-button
                        variant="ghost"
                        size="sm"
                        (buttonClick)="confirmDelete(appointment.id)"
                      >
                        {{ translate('common.delete') }}
                      </app-button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  protected appointmentService = inject(AppointmentService);
  protected patientService = inject(PatientService);
  private translationService = inject(TranslationService);
  private fb = inject(FormBuilder);

  protected filterForm = this.fb.group({
    search: [''],
    status: [''],
  });

  ngOnInit(): void {
    this.loadAppointments();
    this.patientService.loadPatients();
  }

  protected loadAppointments(): void {
    this.appointmentService.loadAppointments();
  }

  protected applyFilters(): void {
    const { search, status } = this.filterForm.value;

    // Implementar lógica de filtro
    // Por exemplo, filtrar por status
    const filters: any = {};

    if (status) {
      filters.status = status as AppointmentStatus;
    }

    // O filtro de busca seria aplicado no back-end ou
    // poderia ser implementado localmente

    this.appointmentService.loadAppointments(filters);
  }

  protected getPatientName(patientId: string): string {
    const patient = this.patientService.patients().find(p => p.id === patientId);
    return patient ? patient.name : patientId;
  }

  protected formatDate(date: Date): string {
    const locale = this.translationService.currentLanguage() === 'pt' ? ptBR : enUS;
    return format(date, 'PPp', { locale });
  }

  protected getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return 'status-scheduled';
      case AppointmentStatus.Confirmed:
        return 'status-confirmed';
      case AppointmentStatus.Completed:
        return 'status-completed';
      case AppointmentStatus.Cancelled:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  protected confirmDelete(id: string): void {
    if (confirm(this.translate('scheduling.confirmDeleteAppointment'))) {
      this.appointmentService.deleteAppointment(id).subscribe();
    }
  }

  protected translate(key: string): string {
    return this.translationService.translate(key);
  }
}
