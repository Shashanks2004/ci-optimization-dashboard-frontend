import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import AIDecision from "../components/AIDecision";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import CommitTable from "../components/CommitTable";
import ITSpend from "./ITSpend";

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [commits, setCommits] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [metrics, setMetrics] = useState(null);

  /*
     ===============================
     🔥 FETCH GITHUB REPOS
     ===============================
  */
  const fetchRepos = async () => {
    try {
      const res = await fetch("https://ci-optimization-dashboard-backend.onrender.com/api/github/repos", {
        credentials: "include",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        console.log("Not authenticated:", data);
      }
    } catch (err) {
      console.error("Error fetching repos:", err);
    }
  };

  /*
     ===============================
     🔥 FETCH DASHBOARD STATS
     ===============================
  */
  const fetchStats = async () => {
    try {
      const res = await fetch("https://ci-optimization-dashboard-backend.onrender.com/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  /*
     ===============================
     🔥 FETCH COMMITS FOR SELECTED REPO
     ===============================
  */
  const handleFetchCommits = async () => {
    if (!selectedRepo) {
      alert("Please select a repository first");
      return;
    }

    try {
      const res = await fetch(
        `https://ci-optimization-dashboard-backend.onrender.com/api/github/commits/${selectedRepo}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      setCommits(data);
    } catch (err) {
      console.error("Error fetching repo commits:", err);
    }
  };

  /*
     ===============================
     🔥 INITIAL LOAD
     ===============================
  */
  useEffect(() => {
    fetchRepos();
    fetchStats();
  }, []);

  /*
     ===============================
     🚀 SIMULATE COMMIT (Optional)
     ===============================
  */
  const simulateCommit = async () => {
    try {
      await fetch("https://ci-optimization-dashboard-backend.onrender.com/api/commits/simulate", {
        method: "POST",
      });

      fetchStats();
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuth");
    navigate("/");
  };
  
  useEffect(() => {
  if (!selectedRepo) return;

  fetch(`https://ci-optimization-dashboard-backend.onrender.com/api/github/metrics/${selectedRepo}`, {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => setMetrics(data))
    .catch(err => console.error(err));
}, [selectedRepo]);

  /*
     ===============================
     🔥 CI HEALTH CALCULATION
     ===============================
  */
  const total = commits.length;
  const successCount = commits.filter(
    (c) => c.status === "Success"
  ).length;

  const healthScore =
    total > 0 ? Math.round((successCount / total) * 100) : 0;

  const getHealthColor = (score) => {
    if (score >= 80) return "#2E7D32";
    if (score >= 50) return "#EF6C00";
    return "#C62828";
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen text-[#4E342E] overflow-x-hidden"
      style={{
        background: `
          linear-gradient(
            135deg,
            #F8EDE3 0%,
            #EAD7C3 40%,
            #DDB892 75%,
            #C89F7A 100%
          )
        `,
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />

        <div className="
  p-4 md:p-8
  space-y-6 md:space-y-8
  bg-white/30
  backdrop-blur-md
  md:rounded-tl-3xl
  shadow-xl
  w-full
  overflow-x-hidden
">

          {activeTab === "overview" && (
            <>
              {/* ================= REPO DROPDOWN ================= */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-3">
                  📦 Select GitHub Repository
                </h2>

                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 shadow-sm"
                >
                  <option value="">Select Repository</option>
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.name}>
                      {repo.name}
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex justify-center md:justify-end">
                  <button
                    onClick={handleFetchCommits}
                    className="bg-gradient-to-r from-[#5C4033] to-[#8D6E63]
                               text-white px-4 py-2 rounded-xl
                               hover:scale-105 transition duration-300"
                  >
                    📥 Fetch Commits
                  </button>
                </div>
              </div>

              {/* ================= STATS ================= */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                    <StatCard title="Total Builds" value={metrics?.totalBuilds ?? 0} />
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                    <StatCard
                      title="Failure Rate"
                      value={(metrics?.failureRate ?? 0) + "%"}
                    />
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                    <StatCard
                      title="Successful Builds"
                      value={metrics?.successful ?? 0}
                    />
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                    <StatCard
                      title="Avg Duration (s)"
                      value={metrics?.avgDuration ?? 0}
                    />
                  </div>
                </div>
              )}

              {/* ================= CI HEALTH ================= */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: getHealthColor(healthScore),
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "18px",
                }}
              >
                🚦 CI Health Score: {metrics?.healthScore ?? 0}%
              </div>

              {/* ================= SIMULATE ================= */}
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={simulateCommit}
                  className="bg-gradient-to-r from-[#C89F7A] to-[#A47551]
                             text-white px-5 py-2.5 rounded-xl
                             font-semibold shadow-md
                             hover:scale-105 transition duration-300"
                >
                  🚀 Simulate Commit
                </button>
              </div>

              {/* ================= TABLE + AI ================= */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <CommitTable  selectedRepo={selectedRepo} commits={commits} />
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                  <AIDecision />
                </div>
              </div>
            </>
          )}

          {activeTab === "it-spend" && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <ITSpend />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}