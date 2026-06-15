import { Eye, Trash2 } from 'lucide-react';
import { TYPE_COLORS, TYPE_LABELS } from '../utils/typeColors';

interface Props {
  credential: any;
  onView: (id: string) => void;
  viewLoading: boolean;
  onDelete: () => void;
}

export default function CredentialCard({
  credential,
  onView,
  viewLoading,
  onDelete,
}: Props) {
  const colors = TYPE_COLORS[credential.type];
  const label = TYPE_LABELS[credential.type];

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

      <div className="border-t border-gray-800 my-3" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => onView(credential.id)}
          title="View"
          disabled={viewLoading}
          className="text-gray-400 hover:text-violet-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors p-1.5 rounded-lg hover:bg-violet-500/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          {viewLoading ? (
            <span className="w-4 h-4 border-2 border-gray-500/40 border-t-violet-400 rounded-full animate-spin" />
          ) : (
            <Eye size={16} />
          )}
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
