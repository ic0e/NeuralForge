import React, { useState, useEffect, useCallback } from "react";
import { LineChart } from "@mui/x-charts";

interface TrainingHistoryEntry {
  id: string;
  timestamp: string;
  dataset: string;
  config: {
    epochs: number;
    batchSize: number;
    optimizer: string;
    learningRate: number;
    demoMode: boolean;
  };
  layers: number;
  finalLoss: number;
  finalAccuracy: number;
  lossHistory: number[];
  accuracyHistory: number[];
}

interface TrainingHistoryProps {
  onSelectHistory: (entry: TrainingHistoryEntry | null) => void;
  selectedHistoryId: string | null;
}

const ITEMS_PER_PAGE = 5;

export default function TrainingHistory({
  onSelectHistory,
  selectedHistoryId,
}: TrainingHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<TrainingHistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/training_history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error("Failed to fetch training history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const deleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/training_history/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setHistory((prev) => prev.filter((h) => h.id !== id));
        if (selectedHistoryId === id) {
          onSelectHistory(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
            : "rgba(100, 100, 140, 0.2)",
          color: isOpen ? "#fff" : "#a5a8c4",
          border: isOpen
            ? "1px solid rgba(139, 92, 246, 0.5)"
            : "1px solid rgba(100, 100, 140, 0.15)",
        }}
        title="Training History"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        History
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden"
          style={{
            width: "380px",
            background: "linear-gradient(180deg, #161b2e 0%, #0f1322 100%)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow:
              "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#e2e4f0",
                letterSpacing: "0.02em",
              }}
            >
              Training History
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#6b6f8a",
              }}
            >
              {history.length} run{history.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Content */}
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {isLoading ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#6b6f8a",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(139, 92, 246, 0.3)",
                    borderTop: "2px solid #7c3aed",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 8px",
                  }}
                />
                Loading...
              </div>
            ) : history.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#4a4e68",
                  fontSize: "12px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ margin: "0 auto 8px", opacity: 0.5 }}
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                No training history yet.
                <br />
                Complete a training run to see it here.
              </div>
            ) : (
              paginatedHistory.map((entry, idx) => {
                const isSelected = selectedHistoryId === entry.id;
                const globalIdx = currentPage * ITEMS_PER_PAGE + idx;

                return (
                  <div
                    key={entry.id}
                    onClick={() =>
                      onSelectHistory(isSelected ? null : entry)
                    }
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: isSelected
                        ? "rgba(139, 92, 246, 0.1)"
                        : "transparent",
                      borderLeft: isSelected
                        ? "2px solid #7c3aed"
                        : "2px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Row 1: Number, Dataset, Timestamp */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#4a4e68",
                            fontFamily: "monospace",
                            width: "18px",
                          }}
                        >
                          #{globalIdx + 1}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: isSelected ? "#c4b5fd" : "#d1d5f0",
                          }}
                        >
                          {entry.dataset}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#5a5e78",
                          }}
                        >
                          {formatTimestamp(entry.timestamp)}
                        </span>
                        <button
                          onClick={(e) => deleteEntry(entry.id, e)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#4a4e68",
                            cursor: "pointer",
                            padding: "2px",
                            fontSize: "14px",
                            lineHeight: 1,
                            borderRadius: "3px",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#ef4444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#4a4e68")
                          }
                          title="Delete this entry"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Stats pills */}
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginLeft: "26px",
                      }}
                    >
                      <Pill
                        label="Loss"
                        value={entry.finalLoss?.toFixed(4)}
                        color="#f87171"
                      />
                      <Pill
                        label="Acc"
                        value={
                          (entry.finalAccuracy * 100).toFixed(1) + "%"
                        }
                        color="#34d399"
                      />
                      <Pill
                        label={entry.config.optimizer}
                        value={`${entry.config.epochs}ep`}
                        color="#60a5fa"
                      />
                      {entry.config.demoMode && (
                        <Pill label="Demo" value="" color="#fbbf24" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: currentPage === 0 ? "#3a3e58" : "#8b90b0",
                  cursor: currentPage === 0 ? "default" : "pointer",
                  borderRadius: "6px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  transition: "all 0.15s",
                }}
              >
                ‹ Prev
              </button>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b6f8a",
                  fontFamily: "monospace",
                }}
              >
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage === totalPages - 1}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color:
                    currentPage === totalPages - 1
                      ? "#3a3e58"
                      : "#8b90b0",
                  cursor:
                    currentPage === totalPages - 1 ? "default" : "pointer",
                  borderRadius: "6px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  transition: "all 0.15s",
                }}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      )}

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* Small stat pill */
function Pill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        fontFamily: "monospace",
        padding: "1px 6px",
        borderRadius: "4px",
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color: color,
      }}
    >
      <span style={{ opacity: 0.7 }}>{label}</span>
      {value && (
        <>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ fontWeight: 600 }}>{value}</span>
        </>
      )}
    </span>
  );
}

/* Comparison Chart - rendered outside the dropdown */
export function ComparisonChart({
  entry,
  onClose,
}: {
  entry: TrainingHistoryEntry;
  onClose: () => void;
}) {
  const chartSx = {
    height: 300,
    "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": { fill: "white" },
    "& .MuiChartsAxis-root .MuiChartsAxis-label": { fill: "white" },
    "& .MuiChartsAxis-root line": { stroke: "white" },
    "& .MuiChartsAxis-root .MuiChartsAxis-line": { stroke: "white" },
    "& .MuiChartsAxis-root .MuiChartsAxis-tick": { stroke: "white" },
    "& .MuiChartsAxis-root text": { fill: "white" },
  };

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0d1117 0%, #0b0f1a 100%)",
        border: "1px solid rgba(139, 92, 246, 0.15)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(139, 92, 246, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#c4b5fd",
            }}
          >
            Comparing: {entry.dataset}
          </span>
          <span style={{ fontSize: "10px", color: "#5a5e78" }}>
            {new Date(entry.timestamp).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <Pill
              label="Loss"
              value={entry.finalLoss?.toFixed(4)}
              color="#f87171"
            />
            <Pill
              label="Acc"
              value={(entry.finalAccuracy * 100).toFixed(1) + "%"}
              color="#34d399"
            />
            <Pill
              label={entry.config.optimizer}
              value={`LR ${entry.config.learningRate}`}
              color="#60a5fa"
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8b90b0",
              cursor: "pointer",
              borderRadius: "6px",
              padding: "3px 8px",
              fontSize: "11px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#ef4444")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#8b90b0")
            }
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "12px 16px" }} className="text-white">
        {entry.lossHistory.length > 0 ? (
          <>
            <LineChart
              series={[
                {
                  data: entry.lossHistory,
                  label: "Loss",
                  yAxisId: "leftAxisId",
                  color: "#f97316",
                },
                {
                  data: entry.accuracyHistory,
                  label: "Accuracy",
                  yAxisId: "rightAxisId",
                  color: "#22d3ee",
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: entry.lossHistory.map(
                    (_: number, i: number) => `E${i + 1}`
                  ),
                },
              ]}
              yAxis={[
                { id: "leftAxisId", width: 50 },
                { id: "rightAxisId", position: "right" },
              ]}
              sx={chartSx}
            />
            <div
              style={{
                display: "flex",
                gap: "24px",
                padding: "4px 0",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "#f97316" }}>
                Loss:{" "}
                {entry.lossHistory.length
                  ? Number(
                    entry.lossHistory[entry.lossHistory.length - 1]
                  ).toFixed(4)
                  : "—"}
              </p>
              <p className="text-sm font-semibold" style={{ color: "#22d3ee" }}>
                Accuracy:{" "}
                {entry.accuracyHistory.length
                  ? (
                    Number(
                      entry.accuracyHistory[
                      entry.accuracyHistory.length - 1
                      ]
                    ) * 100
                  ).toFixed(2) + "%"
                  : "—"}
              </p>
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: "#4a4e68",
              fontSize: "12px",
            }}
          >
            No epoch data recorded for this run.
          </div>
        )}
      </div>
    </div>
  );
}
