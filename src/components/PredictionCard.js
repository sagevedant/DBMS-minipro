'use client';

export default function PredictionCard({ marks }) {
  if (!marks || marks.length === 0) {
    return (
      <div className="prediction-card">
        <div className="prediction-label">🔮 Next Semester Prediction</div>
        <div className="prediction-value" style={{ fontSize: '1.5rem' }}>
          No data yet
        </div>
        <div className="prediction-sub">Add semester marks to see predictions</div>
      </div>
    );
  }

  const sorted = [...marks].sort((a, b) => a.semester - b.semester);
  const values = sorted.map(m => parseFloat(m.marks));
  const lastSemester = sorted[sorted.length - 1].semester;
  const nextSemester = lastSemester + 1;

  // Law of Averages: average of last 3 semesters (or all if < 3)
  const recentValues = values.slice(-3);
  const predicted = recentValues.reduce((sum, v) => sum + v, 0) / recentValues.length;
  const predictedRounded = Math.round(predicted * 100) / 100;

  // Determine trend
  const prevAvg = values.length >= 2
    ? values.slice(-2, -1)[0]
    : values[0];
  const trend = predicted > prevAvg ? 'up' : predicted < prevAvg ? 'down' : 'stable';
  const trendEmoji = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  const trendText = trend === 'up' ? 'Upward trend' : trend === 'down' ? 'Downward trend' : 'Stable';

  const getGrade = (m) => {
    if (m >= 9.0) return 'A+';
    if (m >= 8.0) return 'A';
    if (m >= 7.0) return 'B+';
    if (m >= 6.0) return 'B';
    if (m >= 5.0) return 'C';
    if (m >= 4.0) return 'D';
    return 'F';
  };

  return (
    <div className="prediction-card fade-in">
      <div className="prediction-label">🔮 Predicted — Semester {nextSemester > 8 ? 'Next' : nextSemester}</div>
      <div className="prediction-value">{predictedRounded} CGPA</div>
      <div className="prediction-sub">
        Grade: <strong>{getGrade(predictedRounded)}</strong> &nbsp;|&nbsp; {trendEmoji} {trendText}
      </div>
      <div className="prediction-sub" style={{ marginTop: '0.25rem', fontSize: '0.78rem' }}>
        Based on average of last {recentValues.length} semester{recentValues.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
