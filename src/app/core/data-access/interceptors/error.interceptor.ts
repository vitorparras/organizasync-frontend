import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/application/auth/auth.service';
import { ToastService } from '@shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado ou inválido
        authService.logout();
        router.navigate(['/auth/login']);
        toastService.show({
          title: 'Sessão expirada',
          description: 'Por favor, faça login novamente.',
          variant: 'destructive',
        });
      } else if (error.status === 403) {
        // Acesso não autorizado
        toastService.show({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar este recurso.',
          variant: 'destructive',
        });
      } else if (error.status === 0) {
        // Erro de conexão
        toastService.show({
          title: 'Erro de conexão',
          description:
            'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          variant: 'destructive',
        });
      } else {
        // Outros erros
        const errorMessage = error.error?.message || 'Ocorreu um erro. Tente novamente mais tarde.';
        toastService.show({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      }

      return throwError(() => error);
    })
  );
};
