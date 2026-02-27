import React, { useEffect, useState } from "react";
import CITrendChart from "../components/CITrendChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#7B4F3B", "#8B5E3C", "#A47148", "#5C4033"];

export default function ITSpendDashboard() {

  const [activeTab, setActiveTab] = useState("itspend");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [repoList, setRepoList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const logout = () => {
    console.log("Logout");
  };

  // 🔥 Fetch available repos
  useEffect(() => {
    fetch("https://ci-optimization-dashboard-backend.onrender.com/api/github/repos", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setRepoList(data);
      })
      .catch(err => console.error("Error fetching repos:", err));
  }, []);

  // 🔥 When repo changes → simulate dynamic spend data
  useEffect(() => {
    if (!selectedRepo) return;

    // Example dynamic generation based on repo
    const randomBase = Math.floor(Math.random() * 10000) + 10000;

    setMonthlyData([
      { name: "Jan", spend: randomBase },
      { name: "Feb", spend: randomBase + 3000 },
      { name: "Mar", spend: randomBase + 6000 },
      { name: "Apr", spend: randomBase - 2000 },
      { name: "May", spend: randomBase + 8000 },
      { name: "Jun", spend: randomBase + 5000 },
    ]);

    setCategoryData([
      { name: "Cloud", value: randomBase * 2 },
      { name: "Infrastructure", value: randomBase * 1.5 },
      { name: "DevOps", value: randomBase },
      { name: "Security", value: randomBase * 0.8 },
    ]);

  }, [selectedRepo]);

  return (
    <div className="flex min-h-screen text-[#4E342E] bg-gradient-to-br from-[#F8EDE3] to-[#C89F7A]">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />

        <div className="p-8 space-y-8">

          <h1 className="text-2xl font-semibold">IT Spend Dashboard</h1>

          {/* 🔽 REPO SELECTOR */}
          <div>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="p-3 rounded-lg shadow-md border"
            >
              <option value="">Select Repository</option>
              {repoList.map((repo, index) => (
                <option key={index} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>

          {/* Only show charts if repo selected */}
          {selectedRepo && (
            <div className="flex gap-6">

              {/* Monthly Spend Chart */}
              <div className="bg-white p-5 rounded-xl shadow-md w-1/3">
                <h4 className="mb-3 font-medium">Monthly Spend</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="spend" fill="#A47148" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Pie Chart */}
              <div className="bg-white p-5 rounded-xl shadow-md w-1/3">
                <h4 className="mb-3 font-medium">Category Breakdown</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* AI Risk Trend Chart */}
              <div className="bg-white p-5 rounded-xl shadow-md w-1/3">
                <h4 className="mb-3 font-medium">AI Risk Trend</h4>
                <CITrendChart selectedRepo={selectedRepo} />
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}