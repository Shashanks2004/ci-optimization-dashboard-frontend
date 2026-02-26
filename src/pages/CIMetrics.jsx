import React, { useState, useEffect } from "react";
import { BarChart2 } from "lucide-react";
import CITrendChart from "../components/CITrendChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function CIMetrics() {
  const [activeTab, setActiveTab] = useState("ci-metrics");
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(
    localStorage.getItem("selectedRepo") || ""
  );
  const [metrics, setMetrics] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [latestCommitId, setLatestCommitId] = useState(null);
  

  const logout = () => {
    console.log("Logout");
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/github/repos",
          { credentials: "include" }
        );

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

    fetchRepos();
  }, []);

  useEffect(() => {
    if (!selectedRepo) return;

    const fetchMetrics = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/github/metrics/${selectedRepo}`,
          { credentials: "include" }
        );

        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    fetchMetrics();
  }, [selectedRepo]);

  useEffect(() => {
  if (!selectedRepo) return;

  const fetchCommits = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/github/commits/${selectedRepo}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.length > 0) {
        setLatestCommitId(data[0].id); // first = latest
      }
    } catch (err) {
      console.error("Error fetching commits:", err);
    }
  };

  fetchCommits();
}, [selectedRepo]);

  /* ===============================
     AI OPTIMIZATION
  =============================== */
  const handleAISuggestion = async () => {
  if (!selectedRepo || !metrics) return;

  setLoadingAI(true);
  try {
    const res = await fetch("http://localhost:5000/api/ai/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        repo: selectedRepo,
        successRate: metrics.successRate ?? 0,
        avgBuildTime: metrics.avgBuildTime ?? 0,
        totalBuilds: metrics.totalBuilds ?? 0,
      }),
    });

    const data = await res.json();
    setAiSuggestion(data.suggestion);
  } catch (err) {
    console.error(err);
  }
  setLoadingAI(false);
};
  /* ===============================
     HANDLE REPO CHANGE
  =============================== */
  const handleRepoChange = (e) => {
    const repo = e.target.value;
    setSelectedRepo(repo);
    localStorage.setItem("selectedRepo", repo);
    setMetrics(null);
    setAiSuggestion("");
  };

  return (
  <div className="flex min-h-screen text-[#4E342E] bg-gradient-to-br from-[#F8EDE3] to-[#C89F7A]">

    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

    <div className="flex-1 flex flex-col">
      <Navbar onLogout={logout} />

      <div className="p-8 space-y-8">
        <div className="p-6 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg">

          <h2 className="text-2xl font-semibold text-[#5C4033] mb-6 flex items-center gap-2">
            <BarChart2 size={24} />
            CI Analytics & Optimization
          </h2>

          <div className="mb-6 p-4 bg-[#F8EDE3] rounded-xl shadow text-sm">
  <p>
    This module analyzes GitHub CI/CD pipeline performance by evaluating 
    build success rates, execution time, and workflow configuration. 
    It leverages AI to generate optimization recommendations and 
    executive-level insights to improve reliability, stability, 
    and deployment readiness.
  </p>
</div>

          {/* Repo Selector */}
          <div className="mb-6">
            <select
              value={selectedRepo}
              onChange={handleRepoChange}
              className="w-full p-3 rounded-xl border border-gray-300 shadow-sm"
            >
              <option value="">Select Repository</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>

          {!selectedRepo ? (
            <p className="text-[#8D6E63]">
              Please select a repository to view CI analytics.
            </p>
          ) : (
            <>
              {/* 🔥 CI HEALTH SCORE (New Highlight Card) */}
              {metrics && (
                <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#5C4033]">
                  <h3 className="text-sm text-gray-600">CI Health Score</h3>
                  <p className="text-4xl font-bold text-[#5C4033]">
                    {metrics.successRate ?? 0}/100
                  </p>
                </div>
              )}

              {/* Summary Cards */}
              {metrics && (
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                    <h3 className="text-sm">Success Rate</h3>
                    <p className="text-2xl font-bold">
                      {metrics.successRate ?? 0}%
                    </p>
                  </div>

                  <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                    <h3 className="text-sm">Avg Build Time</h3>
                    <p className="text-2xl font-bold">
                      {metrics.avgBuildTime ?? 0} mins
                    </p>
                  </div>

                  <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                    <h3 className="text-sm">Total Builds</h3>
                    <p className="text-2xl font-bold">
                      {metrics.totalBuilds ?? 0}
                    </p>
                  </div>
                </div>
              )}

              {/* Trend Chart */}
              <CITrendChart selectedRepo={selectedRepo} />

              {/* AI Optimization Section */}
              <div className="mt-10">
                <button
                  onClick={handleAISuggestion}
                  className="px-6 py-3 bg-[#5C4033] text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  {loadingAI ? "Generating..." : "Get AI Optimization Suggestion"}
                </button>

                {aiSuggestion && (
                  <div className="mt-6 p-6 bg-[#F8EDE3] rounded-xl shadow">
                    <h3 className="font-semibold mb-3">
                      AI Optimization Insight
                    </h3>
                    <p>{aiSuggestion}</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  </div>
);
}