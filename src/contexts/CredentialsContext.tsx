import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Credential, CredentialType } from '../types';

const sampleCredentials: Credential[] = [
  {
    id: '1',
    platformName: 'Chase Bank',
    type: 'BANK_APP',
    websiteUrl: 'https://chase.com',
    email: 'johndoe@gmail.com',
    username: 'john_doe',
    password: 'BankPass#2024',
    pinNumber: '4521',
    accountNumber: '4521-XXXX-XXXX-8823',
    notes: 'Primary checking account',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    platformName: 'Gmail',
    type: 'EMAIL',
    websiteUrl: 'https://gmail.com',
    email: 'johndoe@gmail.com',
    password: 'GmailP@ss99',
    notes: 'Main personal email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    platformName: 'Instagram',
    type: 'SOCIAL_MEDIA',
    websiteUrl: 'https://instagram.com',
    username: '@johndoe_ig',
    password: 'Insta$ecure22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    platformName: 'Netflix',
    type: 'STREAMING',
    websiteUrl: 'https://netflix.com',
    email: 'johndoe@gmail.com',
    password: 'Netflix#Stream1',
    notes: 'Family plan - 4 screens',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    platformName: 'MetaMask',
    type: 'CRYPTO_WALLET',
    websiteUrl: 'https://metamask.io',
    password: 'MetaWallet!99',
    seedPhrase: 'abandon ability able about above absent absorb abstract absurd abuse access accident',
    notes: 'Ethereum wallet - keep seed phrase safe!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    platformName: 'Slack',
    type: 'WORK_TOOL',
    websiteUrl: 'https://slack.com',
    email: 'john@company.com',
    password: 'SlackWork@2024',
    notes: 'Company workspace',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    platformName: 'Steam',
    type: 'GAMING',
    websiteUrl: 'https://store.steampowered.com',
    username: 'johndoe_gamer',
    password: 'Steam@Game2024',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    platformName: 'Coinbase',
    type: 'CRYPTO_WALLET',
    websiteUrl: 'https://coinbase.com',
    email: 'johndoe@gmail.com',
    password: 'Coin$afe2024',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    platformName: 'Bank of America',
    type: 'BANK_APP',
    websiteUrl: 'https://bankofamerica.com',
    username: 'johndoe_boa',
    password: 'BoABank#99',
    pinNumber: '7823',
    accountNumber: '7823-XXXX-XXXX-1195',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    platformName: 'Amazon',
    type: 'SHOPPING',
    websiteUrl: 'https://amazon.com',
    email: 'johndoe@gmail.com',
    password: 'Amazon@Shop24',
    notes: 'Prime subscription active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface CredentialsContextValue {
  credentials: Credential[];
  filteredCredentials: Credential[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  addCredential: (data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCredential: (id: string, data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteCredential: (id: string) => void;
}

const CredentialsContext = createContext<CredentialsContextValue | null>(null);

export function CredentialsProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credential[]>(sampleCredentials);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredCredentials = useMemo(() => {
    return credentials.filter(cred => {
      const matchesSearch =
        searchTerm === '' ||
        cred.platformName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cred.username && cred.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cred.email && cred.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'ALL' || cred.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [credentials, searchTerm, filterType]);

  const addCredential = (data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setCredentials(prev => [
      ...prev,
      { ...data, id: `cred-${Date.now()}`, createdAt: now, updatedAt: now },
    ]);
  };

  const updateCredential = (id: string, data: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    setCredentials(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      )
    );
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CredentialsContext.Provider
      value={{
        credentials,
        filteredCredentials,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        addCredential,
        updateCredential,
        deleteCredential,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
}

export function useCredentials() {
  const ctx = useContext(CredentialsContext);
  if (!ctx) throw new Error('useCredentials must be used within CredentialsProvider');
  return ctx;
}

export const TYPE_LABELS: Record<CredentialType, string> = {
  BANK_APP: 'Bank App',
  SOCIAL_MEDIA: 'Social Media',
  EMAIL: 'Email Account',
  STREAMING: 'Streaming',
  CRYPTO_WALLET: 'Crypto Wallet',
  WORK_TOOL: 'Work Tool',
  GAMING: 'Gaming',
  SHOPPING: 'Shopping',
  OTHER: 'Other',
};
