import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      let errorMessage = 'An error occurred';

      if (error instanceof HttpErrorResponse) {
        // Standard HTTP error (4xx, 5xx, or network failure wrapped by Angular)
        if (error.status === 0) {
          errorMessage = 'Network error – please check your internet connection';
        } else if (error.error && typeof error.error === 'object' && error.error !== null && 'message' in error.error) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else {
          errorMessage = error.message || `Error Code: ${error.status}`;
        }
      } else if (error instanceof Error) {
        // Raw JS error (possible in SSR or edge cases)
        errorMessage = error.message || 'An unexpected error occurred';
      } else {
        // Fallback for string errors or other types
        errorMessage = String(error);
      }

      console.error('HTTP Error:', errorMessage, error);
      return throwError(() => error);
    })
  );
};