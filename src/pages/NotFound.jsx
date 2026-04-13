import { useNavigate } from "react-router-dom";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center space-y-6">
        <Search className="w-16 h-16 text-slate-400 mx-auto" />
        <div>
          <h1 className="text-6xl font-black text-slate-900">404</h1>
          <p className="text-slate-600 mt-2">Page Not Found</p>
        </div>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          <Home className="w-4 h-4" />
          Go Home
        </button>
      </div>
    </div>
  );
}