import { AlertTriangle } from 'lucide-react';
import type { Credential } from '../../types';
import { useCredentials } from '../../contexts/CredentialsContext';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  credential: Credential;
  onClose: () => void;
}

export default function DeleteModal({ credential, onClose }: Props) {
  const { deleteCredential } = useCredentials();
  const { showToast } = useToast();

  const handleDelete = () => {
    deleteCredential(credential.id);
    showToast('Credential deleted', 'error');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Delete Credential</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <strong className="text-white">"{credential.platformName}"</strong>? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px]"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
