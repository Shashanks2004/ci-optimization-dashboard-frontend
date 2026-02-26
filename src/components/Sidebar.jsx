import {
  LayoutDashboard,
  IndianRupee,
  BarChart2,
  ShieldCheck,
  Brain,
  LogOut,
  Link as LinkIcon,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="h-screen w-64 p-6 hidden md:flex flex-col
                 bg-white/40 backdrop-blur-md
                 border-r border-[#DDB892]"
    >
      <h1 className="text-2xl font-bold text-[#5C4033] mb-10">
        CIO Panel
      </h1>

      <nav className="flex-1 space-y-3">

        <SidebarItem
          to="/dashboard"
          icon={<LayoutDashboard />}
          label="Overview"
          active={isActive("/dashboard")}
        />

        <SidebarItem
          to="/it-spend"
          icon={<IndianRupee />}
          label="AI Risk Forecast"
          active={isActive("/it-spend")}
        />

        {/* 🔥 NEW CONNECTIONS LINK */}
        <SidebarItem
          to="/connections"
          icon={<LinkIcon />}
          label="Connections"
          active={isActive("/connections")}
        />

        <SidebarItem
          to="/ci-metrices"
          icon={<BarChart2 />}
          label="CI Analysis"
          active={isActive("/ci-metrices")}
        />

        <SidebarItem
          to="/security"
          icon={<ShieldCheck />}
          label="Security"
          active={isActive("/security")}
        />

        <SidebarItem
          to="/ai-insights"
          icon={<Brain />}
          label="AI Insights"
          active={isActive("/ai-insights")}
        />

      </nav>

      <div className="border-t border-[#DDB892] pt-4">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer
                     text-[#6D4C41] hover:bg-[#EAD7C3]/50 hover:text-[#4E342E]"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl
        transition-all duration-200
        ${
          active
            ? "bg-[#DDB892]/40 text-[#5C4033] shadow-md"
            : "text-[#6D4C41] hover:bg-[#EAD7C3]/50 hover:text-[#4E342E]"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}