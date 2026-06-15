import { useEffect, useState } from "react";
import {
  Menu,
  Plus,
  Search,
  Shield,
  CreditCard,
  Share2,
  Coins,
  Layers,
  Lock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CredentialCard from "../components/CredentialCard";
import ViewModal from "../components/modals/ViewModal";
import AddEditModal from "../components/modals/AddEditModal";
import DeleteModal from "../components/modals/DeleteModal";
import { getAllCredentialsAPI, getAllCredentialsStaticAPI, getCredentialByIdAPI } from "../api";

const TYPE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "All Types", value: "ALL" },
  { label: "Bank App", value: "BANK_APP" },
  { label: "Social Media", value: "SOCIAL_MEDIA" },
  { label: "Email Account", value: "EMAIL" },
  { label: "Streaming Service", value: "STREAMING" },
  { label: "Crypto Wallet", value: "CRYPTO_WALLET" },
  { label: "Work Tool", value: "WORK_TOOL" },
  { label: "Gaming", value: "GAMING" },
  { label: "Shopping", value: "SHOPPING" },
  { label: "Other", value: "OTHER" },
];

interface MetricCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  accentClass: string;
  borderClass: string;
}

function MetricCard({
  icon,
  count,
  label,
  accentClass,
  borderClass,
}: MetricCardProps) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-xl p-4 border-l-4 ${borderClass} hover:border-r-gray-800 hover:border-t-gray-800 hover:border-b-gray-800 transition-all duration-200`}
    >
      <div className={`mb-2 ${accentClass}`}>{icon}</div>
      <p className="text-3xl font-bold text-white leading-none mb-1">{count}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}

type ModalState =
  | { type: "none" }
  | { type: "view"; credential: any }
  | { type: "edit"; credential: any }
  | { type: "add" }
  | { type: "delete"; credential: any };

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [filterType, setFilterType] = useState<any>("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [credentialData, setCredentialData] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [viewingCredentialId, setViewingCredentialId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res: any = await getAllCredentialsStaticAPI();
      setStats(res.data.data);
    } catch (error: any) {
      console.error("Error fetching credentials stats:", error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const res: any = await getAllCredentialsAPI(filterType, searchTerm);
      setCredentialData(res.data.data.credentials);
    } catch (error: any) {
      console.error("Error fetching credentials:", error);
      setCredentialData([]);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [count, searchTerm, filterType]);

  useEffect(() => {
    fetchStats();
  }, [count]);

  const changeCount = () => {
    setCount((prevState: number) => {
      return prevState + 1;
    });
  };

  const handleView = async (id: string) => {
    setViewingCredentialId(id);
    setViewLoading(true);
    try {
      const res: any = await getCredentialByIdAPI(id);
      setModal({ type: "view", credential: res.data.data });
    } catch (error: any) {
      console.error("Error fetching credential details:", error);
    } finally {
      setViewLoading(false);
      setViewingCredentialId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — offset by sidebar width on md+ */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-gray-950 border-b border-gray-800 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-400 hover:text-white transition-colors p-1.5 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                My Vault
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e: any) => {
                    const value = e.target.value;

                    setInputValue(value);

                    if (!value.trim()) {
                      setSearchTerm("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchTerm(inputValue.trim());
                    }
                  }}
                  placeholder="Search credentials..."
                  className="bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 pl-9 pr-4 py-2 text-sm w-36 sm:w-64"
                />
              </div>

              {/* Add New */}
              <button
                onClick={() => setModal({ type: "add" })}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg px-3 sm:px-4 py-2 transition-colors duration-200 flex items-center gap-1.5 text-sm min-h-[40px] whitespace-nowrap"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Metrics */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
              Overview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard
                icon={<Shield size={24} />}
                count={stats?.total || 0}
                label="Total Saved"
                accentClass="text-violet-400"
                borderClass="border-l-violet-500"
              />
              <MetricCard
                icon={<CreditCard size={24} />}
                count={stats?.bankApp || 0}
                label="Bank Apps"
                accentClass="text-blue-400"
                borderClass="border-l-blue-500"
              />
              <MetricCard
                icon={<Share2 size={24} />}
                count={stats?.socialMedia || 0}
                label="Social Media"
                accentClass="text-pink-400"
                borderClass="border-l-pink-500"
              />
              <MetricCard
                icon={<Coins size={24} />}
                count={stats?.cryptoWallet || 0}
                label="Crypto"
                accentClass="text-yellow-400"
                borderClass="border-l-yellow-500"
              />
              <MetricCard
                icon={<Layers size={24} />}
                count={stats?.other || 0}
                label="Other"
                accentClass="text-teal-400"
                borderClass="border-l-teal-500"
              />
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors duration-200 px-4 py-2.5 text-sm sm:w-56"
            >
              {TYPE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm">
              Showing{" "}
              <span className="text-white font-medium">
                {credentialData.length}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">
                {stats?.total || 0}
              </span>{" "}
              credentials
            </p>
          </div>

          {/* Credentials grid */}
          {credentialData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Lock size={64} className="text-gray-700 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">
                No credentials found
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">
                Try adjusting your search or add a new credential
              </p>
              <button
                onClick={() => setModal({ type: "add" })}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors duration-200 flex items-center gap-2 min-h-[44px]"
              >
                <Plus size={16} />
                Add New
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {credentialData.map((cred) => (
                <CredentialCard
                  key={cred.id}
                  credential={cred}
                  onView={handleView}
                  viewLoading={viewLoading && viewingCredentialId === cred.id}
                  onDelete={() =>
                    setModal({ type: "delete", credential: cred })
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modal.type === "view" && (
        <ViewModal
          credential={modal.credential}
          onClose={() => setModal({ type: "none" })}
          onEdit={() =>
            setModal({ type: "edit", credential: modal.credential })
          }
        />
      )}
      {modal.type === "edit" && (
        <AddEditModal
          changeCount={changeCount}
          credential={modal.credential}
          onClose={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "add" && (
        <AddEditModal
          changeCount={changeCount}
          onClose={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "delete" && (
        <DeleteModal
          credential={modal.credential}
          changeCount={changeCount}
          onClose={() => setModal({ type: "none" })}
        />
      )}
    </div>
  );
}
