import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Credential } from '../types';
import { TYPE_COLORS, TYPE_LABELS } from '../utils/typeColors';

interface Props {
  credential: Credential;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function maskValue(val: string): string {
  if (!val) return '';
  return val.slice(0, 3) + '•••••';
}

export default function CredentialCard({ credential, onView, onEdit, onDelete }: Props) {
  const colors = TYPE_COLORS[credential.type];
  const label = TYPE_LABELS[credential.type];
  const displayIdentifier = credential.email || credential.username || '';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-white font-bold text-sm uppercase">
            {credential.platformName[0]}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge} ${colors.badgeText}`}
        >
          {label}
        </span>
      </div>

      {/* Platform name */}
      <p className="text-white font-semibold text-base mt-3 truncate">
        {credential.platformName}
      </p>

      {/* Identifier */}
      {displayIdentifier && (
        <p className="text-gray-400 text-sm mt-0.5 truncate">
          {maskValue(displayIdentifier)}
        </p>
      )}

      {/* Password row */}
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-gray-500 text-xs">Password</span>
        <span className="text-gray-400 text-sm">••••••••</span>
      </div>

      <div className="border-t border-gray-800 my-3" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onView}
          title="View"
          className="text-gray-400 hover:text-violet-400 transition-colors p-1.5 rounded-lg hover:bg-violet-500/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="text-gray-400 hover:text-yellow-400 transition-colors p-1.5 rounded-lg hover:bg-yellow-500/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
