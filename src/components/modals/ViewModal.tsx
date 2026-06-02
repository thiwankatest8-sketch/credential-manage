import { useState } from 'react';
import { X, Eye, EyeOff, Copy, Check, ExternalLink } from 'lucide-react';
import type { Credential } from '../../types';
import { TYPE_COLORS, TYPE_LABELS } from '../../utils/typeColors';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  credential: Credential;
  onClose: () => void;
  onEdit: () => void;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      showToast('Copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="text-gray-500 hover:text-violet-400 transition-colors p-1 rounded"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function MaskedField({
  label,
  value,
  copyable = true,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  if (!value) return null;

  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm flex-1 break-all font-mono">
          {visible ? value : '••••••••'}
        </span>
        <button
          onClick={() => setVisible(v => !v)}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded flex-shrink-0"
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        {copyable && <CopyButton value={value} />}
      </div>
    </div>
  );
}

function PlainField({
  label,
  value,
  copyable = false,
  url = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  url?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm flex-1 break-all">{value}</span>
        {url && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-violet-400 transition-colors p-1 rounded flex-shrink-0"
            title="Open"
          >
            <ExternalLink size={14} />
          </a>
        )}
        {copyable && <CopyButton value={value} />}
      </div>
    </div>
  );
}

export default function ViewModal({ credential, onClose, onEdit }: Props) {
  const colors = TYPE_COLORS[credential.type];
  const label = TYPE_LABELS[credential.type];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-bold uppercase">
                {credential.platformName[0]}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">{credential.platformName}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge} ${colors.badgeText}`}
              >
                {label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <PlainField label="Platform Name" value={credential.platformName} />
          <PlainField label="Website URL" value={credential.websiteUrl ?? ''} url />
          <PlainField label="Email" value={credential.email ?? ''} copyable />
          <PlainField label="Username" value={credential.username ?? ''} copyable />
          <MaskedField label="Password" value={credential.password ?? ''} />
          <MaskedField label="PIN Number" value={credential.pinNumber ?? ''} />
          <PlainField label="Account Number" value={credential.accountNumber ?? ''} copyable />
          <MaskedField label="Seed Phrase / Recovery Keys" value={credential.seedPhrase ?? ''} />
          {credential.notes && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Notes</p>
              <p className="text-white text-sm whitespace-pre-wrap">{credential.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button
            onClick={onEdit}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px]"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
