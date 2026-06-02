import type { CredentialType } from '../types';

export const TYPE_COLORS: Record<
  CredentialType,
  { bg: string; text: string; border: string; badge: string; badgeText: string }
> = {
  BANK_APP: {
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-l-blue-500',
    badge: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
  },
  SOCIAL_MEDIA: {
    bg: 'bg-pink-500',
    text: 'text-pink-400',
    border: 'border-l-pink-500',
    badge: 'bg-pink-500/20',
    badgeText: 'text-pink-400',
  },
  EMAIL: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-l-green-500',
    badge: 'bg-green-500/20',
    badgeText: 'text-green-400',
  },
  STREAMING: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-l-red-500',
    badge: 'bg-red-500/20',
    badgeText: 'text-red-400',
  },
  CRYPTO_WALLET: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-l-yellow-500',
    badge: 'bg-yellow-500/20',
    badgeText: 'text-yellow-400',
  },
  WORK_TOOL: {
    bg: 'bg-sky-500',
    text: 'text-sky-400',
    border: 'border-l-sky-500',
    badge: 'bg-sky-500/20',
    badgeText: 'text-sky-400',
  },
  GAMING: {
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-l-orange-500',
    badge: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
  },
  SHOPPING: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
  },
  OTHER: {
    bg: 'bg-gray-500',
    text: 'text-gray-400',
    border: 'border-l-gray-500',
    badge: 'bg-gray-500/20',
    badgeText: 'text-gray-400',
  },
};

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
