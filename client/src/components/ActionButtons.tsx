import React from "react";

interface Props {
  recommending: boolean;
  analysis: any;
  submitting: boolean;
  handleRecommend(): void;
  handleSetReminder(): void;
  handleAnalyze(): void;
  clearAnalysis(): void;
  handleSubmit(): void;
  handleReset(): void;
}

const ActionButtons: React.FC<Props> = ({
  recommending,
  analysis,
  submitting,
  handleRecommend,
  handleSetReminder,
  handleAnalyze,
  clearAnalysis,
  handleSubmit,
  handleReset,
}) => (
  <div className="flex flex-wrap justify-center gap-3 mt-6">
    <button
      onClick={handleRecommend}
      disabled={!analysis || submitting || recommending}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
    >
      {recommending ? (
        <>
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          Recommending…
        </>
      ) : (
        "Recommend Best Resume"
      )}
    </button>
    <button
      onClick={handleSetReminder}
      disabled={submitting}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
    >
      Set Reminder in Google Calendar
    </button>
    <button
      onClick={handleAnalyze}
      disabled={submitting || false /* loadingSkills available prop removed */}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
    >
      Analyze
    </button>
    <button
      onClick={clearAnalysis}
      disabled={submitting}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
    >
      Clear Analyze
    </button>
    <button
      onClick={handleSubmit}
      disabled={submitting}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-green-600 hover:bg-green-700 disabled:opacity-50"
    >
      {submitting ? "Saving…" : "Save"}
    </button>
    <button
      onClick={handleReset}
      disabled={submitting}
      className="px-4 py-2 rounded-full text-white text-sm shadow transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
    >
      Reset Form
    </button>
  </div>
);

export default ActionButtons;
