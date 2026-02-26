import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState("ai-insights");
  const [selectedRepo] = useState(
    localStorage.getItem("selectedRepo") || ""
  );
  const [commits, setCommits] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = () => {
    console.log("Logout");
  };

  useEffect(() => {
    if (!selectedRepo) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch latest commits
        const commitsRes = await fetch(
          `http://localhost:5000/api/github/commits/${selectedRepo}`,
          { credentials: "include" }
        );

        if (!commitsRes.ok) {
          throw new Error("Failed to fetch commits");
        }

        const commitsData = await commitsRes.json();
        setCommits(commitsData || []);

        // Fetch AI executive summary
        const summaryRes = await fetch(
          `http://localhost:5000/api/ai/summary/${selectedRepo}`,
          { credentials: "include" }
        );

        if (!summaryRes.ok) {
          throw new Error("Failed to fetch AI summary");
        }

        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load AI insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRepo]);

  const latest = commits && commits.length > 0 ? commits[0] : null;

  return (
    <div className="flex min-h-screen text-[#4E342E] bg-gradient-to-br from-[#F8EDE3] to-[#C89F7A]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />

        <div className="p-8 space-y-8">
          <div className="p-6 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg">

            <h2 className="text-2xl font-semibold text-[#5C4033] mb-6">
              AI Intelligence Center
            </h2>

            {!selectedRepo && (
              <p className="text-[#8D6E63]">
                Please select a repository from the CI Metrics page.
              </p>
            )}

            {loading && selectedRepo && (
              <p className="text-[#8D6E63]">Loading AI insights...</p>
            )}

            {error && (
              <p className="text-red-600">{error}</p>
            )}

            {!loading && latest && (
              <>
                {/* Latest Commit Section */}
                <div className="grid grid-cols-2 gap-6 mb-8">

                  <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                    <h3 className="font-semibold mb-3">
                      Latest Commit Details
                    </h3>

                    <p>
                      <strong>Commit SHA:</strong>{" "}
                      {latest.sha?.substring(0, 7) || "N/A"}
                    </p>

                    <p>
                      <strong>Author:</strong>{" "}
                      {latest.commit?.author?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {latest.commit?.author?.date
                        ? new Date(
                            latest.commit.author.date
                          ).toLocaleString()
                        : "N/A"}
                    </p>

                    <p className="mt-2">
                      <strong>Message:</strong>
                    </p>

                    <p className="text-sm mt-1">
                      {latest.commit?.message ||
                        "No commit message available."}
                    </p>
                  </div>

                  {/* Repository Activity Insight */}
                  <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                    <h3 className="font-semibold mb-3">
                      Repository Activity Insight
                    </h3>

                    <p className="text-sm">
                      This section displays the latest repository commit
                      fetched directly from GitHub. Monitoring commit
                      frequency, contributor activity, and message trends
                      helps evaluate development velocity and system
                      stability.
                    </p>

                    <p className="mt-3 text-sm text-[#6D4C41]">
                      Use this information alongside CI metrics and AI
                      optimization insights to assess deployment readiness
                      and overall repository health.
                    </p>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="bg-[#F8EDE3] p-5 rounded-xl shadow">
                  <h3 className="font-semibold mb-3">
                    AI Executive Summary
                  </h3>
                  <div className="whitespace-pre-line text-sm">
                    {summary || "No summary available."}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;