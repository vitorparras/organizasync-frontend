import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Observable, catchError, finalize, of, tap } from 'rxjs';
import { PatientRepository } from '@core/data-access/patients/patient.repository';
import type { Patient, PatientFilters } from '@core/domain/patients/models/patient.model';
import { ToastService } from '@shared/ui/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patientRepository = inject(PatientRepository);
  private toastService = inject(ToastService);

  // Estado da aplicação usando Signals
  private patientsSignal = signal<Patient[]>([]);
  private selectedPatientSignal = signal<Patient | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expondo os Signals como readonly
  public patients = this.patientsSignal.asReadonly();
  public selectedPatient = this.selectedPatientSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  constructor() {
    // Exemplo de inicialização de dados
    this.loadPatients();
  }

  loadPatients(filters?: PatientFilters): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.patientRepository
      .getPatients(filters)
      .pipe(
        takeUntilDestroyed(),
        tap(patients => {
          this.patientsSignal.set(patients);
        }),
        catchError(error => {
          this.errorSignal.set('Erro ao carregar pacientes: ' + error.message);
          return of([]);
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      )
      .subscribe();
  }

  loadPatientById(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.patientRepository
      .getPatientById(id)
      .pipe(
        takeUntilDestroyed(),
        tap(patient => {
          this.selectedPatientSignal.set(patient);
        }),
        catchError(error => {
          this.errorSignal.set('Erro ao carregar paciente: ' + error.message);
          return of(null);
        }),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      )
      .subscribe();
  }

  createPatient(
    patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Patient | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.patientRepository.createPatient(patient).pipe(
      tap(newPatient => {
        this.patientsSignal.update(patients => [...patients, newPatient]);
        this.toastService.show({
          title: 'Sucesso',
          description: 'Paciente cadastrado com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao cadastrar paciente: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível cadastrar o paciente.',
          variant: 'destructive',
        });
        return of(null);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.patientRepository.updatePatient(id, patient).pipe(
      tap(updatedPatient => {
        this.patientsSignal.update(patients =>
          patients.map(p => (p.id === id ? updatedPatient : p))
        );

        if (this.selectedPatientSignal()?.id === id) {
          this.selectedPatientSignal.set(updatedPatient);
        }

        this.toastService.show({
          title: 'Sucesso',
          description: 'Paciente atualizado com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao atualizar paciente: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível atualizar o paciente.',
          variant: 'destructive',
        });
        return of(null);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  deletePatient(id: string): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.patientRepository.deletePatient(id).pipe(
      tap(() => {
        this.patientsSignal.update(patients => patients.filter(p => p.id !== id));

        if (this.selectedPatientSignal()?.id === id) {
          this.selectedPatientSignal.set(null);
        }

        this.toastService.show({
          title: 'Sucesso',
          description: 'Paciente excluído com sucesso!',
          variant: 'default',
        });
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao excluir paciente: ' + error.message);
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível excluir o paciente.',
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

  clearSelectedPatient(): void {
    this.selectedPatientSignal.set(null);
  }
}
