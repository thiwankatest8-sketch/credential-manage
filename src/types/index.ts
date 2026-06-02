export type CredentialType =
  | 'BANK_APP'
  | 'SOCIAL_MEDIA'
  | 'EMAIL'
  | 'STREAMING'
  | 'CRYPTO_WALLET'
  | 'WORK_TOOL'
  | 'GAMING'
  | 'SHOPPING'
  | 'OTHER';

export interface Credential {
  id: string;
  platformName: string;
  type: CredentialType;
  websiteUrl?: string;
  email?: string;
  username?: string;
  password?: string;
  pinNumber?: string;
  accountNumber?: string;
  seedPhrase?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
