import { useEffect, useState } from "react";

export default function CommitTable({ selectedRepo }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCommits = async () => {
    if (!selectedRepo) return;

    setLoading(true);

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
      console.error(err);
    }

    setLoading(false);
  };

  // Fetch when repo changes
  useEffect(() => {
    if (selectedRepo) {
      fetchCommits();
    }
  }, [selectedRepo]);

  return (
    <div
      className="bg-white/50 backdrop-blur-md 
                 border border-[#DDB892] 
                 rounded-2xl p-6 shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4 text-[#5C4033]">
        Recent Commits
      </h3>

      {!selectedRepo && (
        <p className="text-[#8D6E63]">
          Please select a repository to view commits.
        </p>
      )}

      {loading && (
        <p className="text-[#8D6E63]">Loading commits...</p>
      )}

      {selectedRepo && !loading && (
        <div className="overflow-x-auto w-full">
  <table className="min-w-[700px] w-full text-sm">
            <thead className="text-[#6D4C41]">
              <tr className="border-b border-[#EAD7C3]">
                <th className="text-left pb-2">Commit</th>
                <th className="text-left pb-2">Message</th>
                <th className="text-left pb-2">Author</th>
                <th className="text-left pb-2">Date</th>
              </tr>
            </thead>

            <tbody className="text-[#4E342E]">
              {commits.map((commit) => (
                <tr
                  key={commit.sha}
                  className="border-t border-[#EAD7C3] hover:bg-white/40 transition duration-200"
                >
                  <td className="py-3 font-medium whitespace-nowrap">
  {commit.sha.slice(0, 7)}
</td>

                  <td className="min-w-[220px]">
  {commit.message}
</td>

                  <td className="whitespace-nowrap">
  {commit.author}
</td>

                  <td className="whitespace-nowrap">
  {new Date(commit.date).toLocaleString()}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}