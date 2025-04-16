import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Observable, catchError, finalize, of, tap } from 'rxjs';
import { AppointmentRepository } from '@core/data-access/scheduling/appointment.repository';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
} from '@core/domain/scheduling/models/appointment.model';
import { ToastService } from '@shared/ui/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentRepository = inject(AppointmentRepository);
  private toastService = inject(ToastService);

  // Estado da aplicação usando Signals
  private appointmentsSignal = signal<Appointment[]>([]);
  private selectedAppointmentSignal = signal<Appointment | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expondo os Signals como readonly
  public appointments = this.appointmentsSignal.asReadonly();
  public selectedAppointment = this.selectedAppointmentSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  constructor() {
    // Exemplo de inicialização de dados
    this.loadAppointments();
  }

  loadAppointments(filters?: AppointmentFilters): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.appointmentRepository
      .getAppointments(filters)
      .pipe(
        takeUntilDestroyed(),
        tap(appointments => {
          this.appointmentsSignal.set(appointments);
        }),
        catchError(error => {
          this.errorSignal.set('Erro ao carregar agendamentos: ' + error.message);
          return of([]);
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      )
      .subscribe();
  }

  loadAppointmentById(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.appointmentRepository
      .getAppointmentById(id)
      .pipe(
        takeUntilDestroyed(),
        tap(appointment => {
          this.selectedAppointmentSignal.set(appointment);
        }),
        catchError(error => {
          this.errorSignal.set('Erro ao carregar agendamento: ' + error.message);
          return of(null);
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      )
      .subscribe();
  }

  createAppointment(
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Appointment | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.appointmentRepository.createAppointment(appointment).pipe(
      tap(newAppointment => {
        this.appointmentsSignal.update(appointments => [...appointments, newAppointment]);
        this.toastService.show({
          title: 'Sucesso',
          description: 'Agendamento criado com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao criar agendamento: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível criar o agendamento.',
          variant: 'destructive',
        });
        return of(null);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.appointmentRepository.updateAppointment(id, appointment).pipe(
      tap(updatedAppointment => {
        this.appointmentsSignal.update(appointments =>
          appointments.map(a => (a.id === id ? updatedAppointment : a))
        );

        if (this.selectedAppointmentSignal()?.id === id) {
          this.selectedAppointmentSignal.set(updatedAppointment);
        }

        this.toastService.show({
          title: 'Sucesso',
          description: 'Agendamento atualizado com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao atualizar agendamento: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível atualizar o agendamento.',
          variant: 'destructive',
        });
        return of(null);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  deleteAppointment(id: string): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.appointmentRepository.deleteAppointment(id).pipe(
      tap(() => {
        this.appointmentsSignal.update(appointments => appointments.filter(a => a.id !== id));

        if (this.selectedAppointmentSignal()?.id === id) {
          this.selectedAppointmentSignal.set(null);
        }

        this.toastService.show({
          title: 'Sucesso',
          description: 'Agendamento excluído com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao excluir agendamento: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível excluir o agendamento.',
          variant: 'destructive',
        });
        return of(false);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      }),
      // Mapeia para boolean para indicar sucesso/falha
      tap(() => true)
    );
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<Appointment | null> {
    return this.updateAppointment(id, { status });
  }

  clearSelectedAppointment(): void {
    this.selectedAppointmentSignal.set(null);
  }
}
