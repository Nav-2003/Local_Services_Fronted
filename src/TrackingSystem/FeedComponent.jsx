import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Api = import.meta.env.VITE_BACKEND_API;

const FeedbackComponent = ({ provider }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider?.email) return;

    const fetchFeedbacks = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3000/api/feedback/getFeedback`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: provider.email }),
          }
        );

        const result = await res.json();

        console.log(result); // 🔥 debug

        // ✅ FIXED HERE
        setFeedbacks(result.feedbacks || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [provider.email]);

  /* ------------------ DERIVED DATA ------------------ */

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((f) => f.rating === Number(filter));

  const total = feedbacks.length;

  const average =
    total > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / total
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => {
    const count = feedbacks.filter((f) => f.rating === r).length;
    return {
      rating: r,
      count,
      percent: total ? (count / total) * 100 : 0,
    };
  });

  /* ------------------ HELPERS ------------------ */

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  /* ------------------ UI ------------------ */

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-5 sticky top-0 z-10">
        <h2 className="text-xl font-bold mb-1">
          {provider.name} Reviews
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">
            {average}
          </span>
          {renderStars(Math.round(average))}
          <span>({total})</span>
        </div>

        {/* DISTRIBUTION */}
        <div className="mt-4 space-y-1">
          {ratingDistribution.map((r) => (
            <div
              key={r.rating}
              className="flex items-center gap-2 text-xs"
            >
              <span className="w-6">{r.rating}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-yellow-400 rounded"
                  style={{ width: `${r.percent}%` }}
                />
              </div>
              <span className="w-6 text-right">
                {r.count}
              </span>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mt-4">
          {["all", 5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(String(r))}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filter === String(r)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r === "all" ? "All" : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* LOADING */}
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          ))}

        {/* REVIEWS */}
        {!loading &&
          filteredFeedbacks.map((f) => (
            <motion.div
              key={f._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {getInitials(f.name)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">
                      {f.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(f.time).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(f.rating)}
                    <span className="text-xs text-green-600 font-medium">
                      Verified
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {f.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

        {/* EMPTY */}
        {!loading && filteredFeedbacks.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            <div className="text-4xl mb-2">🫶</div>
            No reviews for this rating
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackComponent;