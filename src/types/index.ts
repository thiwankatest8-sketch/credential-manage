export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}
