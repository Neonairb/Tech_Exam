import { HttpErrorResponse } from '@angular/common/http';

type ApiErrorBody = {
  mensaje?: string;
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
  field?: string,
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = error.error as ApiErrorBody | string | null;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    if (field) {
      const fieldError = Object.entries(body.errors ?? {}).find(
        ([key]) => key.toLowerCase() === field.toLowerCase(),
      )?.[1]?.[0];

      if (fieldError) {
        return fieldError;
      }

      return fallback;
    }

    const validationError = Object.values(body.errors ?? {}).flat()[0];
    return body.mensaje || validationError || body.detail || body.title || fallback;
  }

  if (error.status === 0) {
    return 'No fue posible conectar con el servidor. Revisa tu conexión e intenta nuevamente.';
  }

  return fallback;
}
