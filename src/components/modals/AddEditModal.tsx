import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { TYPE_LABELS } from "../../utils/typeColors";
import { useToast } from "../../contexts/ToastContext";
import { createCredentialAPI, updateCredentialAPI } from "../../api";

interface Props {
  credential?: any;
  onClose: () => void;
  changeCount: any;
}

const TYPE_OPTIONS: string[] = [
  "BANK_APP",
  "SOCIAL_MEDIA",
  "EMAIL",
  "STREAMING",
  "CRYPTO_WALLET",
  "WORK_TOOL",
  "GAMING",
  "SHOPPING",
  "OTHER",
];

const inputClass =
  "bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 px-4 py-2.5 w-full";

const labelClass = "text-gray-400 text-sm font-medium mb-1 block";

function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  name: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••"}
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function AddEditModal({ credential, onClose,changeCount }: Props) {
  const isEdit = !!credential;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    platformName: credential?.platformName ?? "",
    type: credential?.type ?? "OTHER",
    websiteUrl: credential?.websiteUrl ?? "",
    email: credential?.email ?? "",
    username: credential?.username ?? "",
    password: credential?.password ?? "",
    pinNumber: credential?.pinNumber ?? "",
    accountNumber: credential?.accountNumber ?? "",
    seedPhrase: credential?.seedPhrase ?? "",
    notes: credential?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const saveCredential = async (data: any) => {
    setLoading(true);
    try {
      await createCredentialAPI(data);
      showToast("Credential saved successfully!", "success");
      setLoading(false);
      changeCount();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      showToast(message, "error");
      setLoading(false);
    }
  };

  const updateCredential = async (data: any, id:any) => {
    setLoading(true);
    try {
      await updateCredentialAPI(data, id);
      showToast("Credential updated successfully!", "success");
      setLoading(false);
      changeCount();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      showToast(message, "error");
      setLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.platformName.trim())
      errs.platformName = "Platform name is required";
    if (!form.type) errs.type = "Type is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const data = {
      platformName: form.platformName.trim(),
      type: form.type,
      websiteUrl: form.websiteUrl.trim() || undefined,
      email: form.email.trim() || undefined,
      username: form.username.trim() || undefined,
      password: form.password || undefined,
      pinNumber: form.pinNumber || undefined,
      accountNumber: form.accountNumber.trim() || undefined,
      seedPhrase: form.seedPhrase.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    if (isEdit && credential) {
      await updateCredential(data, credential.id);
    } else {
      await saveCredential(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? "Edit Credential" : "Add New Credential"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {/* Platform Name */}
            <div>
              <label className={labelClass}>
                Platform Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.platformName}
                onChange={(e) => set("platformName")(e.target.value)}
                placeholder="e.g. Chase Bank, Gmail, Netflix"
                className={inputClass}
              />
              {errors.platformName && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.platformName}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type")(e.target.value)}
                className={inputClass}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-400 text-xs mt-1">{errors.type}</p>
              )}
            </div>

            {/* Website URL */}
            <div>
              <label className={labelClass}>Website URL</label>
              <input
                type="text"
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl")(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Username */}
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => set("username")(e.target.value)}
                placeholder="@username"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <PasswordInput
                value={form.password}
                onChange={set("password")}
                name="password"
              />
            </div>

            {/* PIN */}
            <div>
              <label className={labelClass}>PIN Number</label>
              <PasswordInput
                value={form.pinNumber}
                onChange={set("pinNumber")}
                placeholder="1234"
                name="pin"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className={labelClass}>Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => set("accountNumber")(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className={inputClass}
              />
            </div>

            {/* Seed Phrase */}
            <div>
              <label className={labelClass}>Seed Phrase / Recovery Keys</label>
              <textarea
                value={form.seedPhrase}
                onChange={(e) => set("seedPhrase")(e.target.value)}
                placeholder="Enter your 12 or 24 word recovery phrase separated by spaces..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 p-5 border-t border-gray-800 sticky bottom-0 bg-gray-900">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Credential"
              ) : (
                "Save Credential"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
