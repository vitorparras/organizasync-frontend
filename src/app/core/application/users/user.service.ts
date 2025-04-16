import { Injectable, inject, signal } from '@angular/core';
import { type Observable, catchError, finalize, map, of } from 'rxjs';
import { UserRepository } from '@core/data-access/users/user.repository';
import type {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from '@core/domain/users/models/user.model';
import { ToastService } from '@shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRepository = inject(UserRepository);
  private toastService = inject(ToastService);

  // Estado da aplicação usando Signals
  private selectedUserSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Expondo os Signals como readonly
  public selectedUser = this.selectedUserSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  getUserById(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userRepository.getById(id).subscribe({
      next: response => {
        if (response.success && response.data) {
          this.selectedUserSignal.set(response.data);
        } else {
          this.errorSignal.set(response.message || 'Erro ao carregar usuário');
          this.toastService.show({
            title: 'Erro',
            description: response.message || 'Erro ao carregar usuário',
            variant: 'destructive',
          });
        }
      },
      error: error => {
        this.errorSignal.set('Erro ao carregar usuário');
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do usuário',
          variant: 'destructive',
        });
      },
      complete: () => {
        this.loadingSignal.set(false);
      },
    });
  }

  createUser(request: CreateUserRequest): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userRepository.create(request).pipe(
      map(response => {
        if (response.success) {
          this.toastService.show({
            title: 'Sucesso',
            description: 'Usuário criado com sucesso!',
            variant: 'default',
          });
          return true;
        } else {
          this.errorSignal.set(response.message || 'Erro ao criar usuário');
          this.toastService.show({
            title: 'Erro',
            description: response.message || 'Não foi possível criar o usuário',
            variant: 'destructive',
          });
          return false;
        }
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao criar usuário');
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível criar o usuário',
          variant: 'destructive',
        });
        return of(false);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  updateUser(request: UpdateUserRequest): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userRepository.update(request).pipe(
      map(response => {
        if (response.success) {
          if (this.selectedUserSignal()?.id === request.id) {
            this.selectedUserSignal.set(response.data);
          }

          this.toastService.show({
            title: 'Sucesso',
            description: 'Usuário atualizado com sucesso!',
            variant: 'default',
          });
          return true;
        } else {
          this.errorSignal.set(response.message || 'Erro ao atualizar usuário');
          this.toastService.show({
            title: 'Erro',
            description: response.message || 'Não foi possível atualizar o usuário',
            variant: 'destructive',
          });
          return false;
        }
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao atualizar usuário');
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível atualizar o usuário',
          variant: 'destructive',
        });
        return of(false);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  deleteUser(id: string): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userRepository.delete(id).pipe(
      map(() => {
        if (this.selectedUserSignal()?.id === id) {
          this.selectedUserSignal.set(null);
        }

        this.toastService.show({
          title: 'Sucesso',
          description: 'Usuário excluído com sucesso!',
          variant: 'default',
        });
        return true;
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao excluir usuário');
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível excluir o usuário',
          variant: 'destructive',
        });
        return of(false);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.userRepository.changePassword(request).pipe(
      map(response => {
        if (response.success) {
          this.toastService.show({
            title: 'Sucesso',
            description: 'Senha alterada com sucesso!',
            variant: 'default',
          });
          return true;
        } else {
          this.errorSignal.set(response.message || 'Erro ao alterar senha');
          this.toastService.show({
            title: 'Erro',
            description: response.message || 'Não foi possível alterar a senha',
            variant: 'destructive',
          });
          return false;
        }
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao alterar senha');
        this.toastService.show({
          title: 'Erro',
          description: 'Não foi possível alterar a senha',
          variant: 'destructive',
        });
        return of(false);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  clearSelectedUser(): void {
    this.selectedUserSignal.set(null);
  }
}
