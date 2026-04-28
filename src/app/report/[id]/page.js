'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import SemesterForm from '@/components/SemesterForm';
import { PerformanceLineChart, PerformanceBarChart } from '@/components/ReportCharts';
import PredictionCard from '@/components/PredictionCard';

export default function ReportPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (studentError || !studentData) {
      router.push('/');
      return;
    }

    const { data: marksData } = await supabase
      .from('semester_marks')
      .select('*')
      .eq('student_id', id)
      .order('semester', { ascending: true });

    setStudent(studentData);
    setMarks(marksData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDeleteMark = async (markId) => {
    if (!confirm('Delete this semester\'s marks?')) return;

    const { error } = await supabase.from('semester_marks').delete().eq('id', markId);
    if (error) {
      showToast('Failed to delete marks', 'error');
    } else {
      showToast('Marks deleted');
      fetchData();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-spinner"><div className="spinner"></div></div>
        </div>
      </>
    );
  }

  if (!student) return null;

  const sortedMarks = [...marks].sort((a, b) => a.semester - b.semester);
  const values = sortedMarks.map(m => parseFloat(m.marks));
  const avgMarks = values.length > 0
    ? (values.reduce((s, v) => s + v, 0) / values.length).toFixed(2)
    : '—';
  const highestMarks = values.length > 0 ? Math.max(...values).toFixed(2) : '—';
  const lowestMarks = values.length > 0 ? Math.min(...values).toFixed(2) : '—';

  const getMarksBadge = (m) => {
    const v = parseFloat(m);
    if (v >= 75) return 'high';
    if (v >= 50) return 'mid';
    return 'low';
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Back button */}
        <button className="back-link" onClick={() => router.push('/')}>
          ← Back to all students
        </button>

        {/* Student Header */}
        <div className="report-header fade-in">
          <div className="report-avatar">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="report-name">{student.name}</div>
            <div className="report-roll">Roll No: {student.roll_no}</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row fade-in">
          <div className="stat-card">
            <div className="stat-value">{sortedMarks.length}</div>
            <div className="stat-label">Semesters</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{avgMarks}</div>
            <div className="stat-label">Average</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{highestMarks}</div>
            <div className="stat-label">Highest</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{lowestMarks}</div>
            <div className="stat-label">Lowest</div>
          </div>
        </div>

        {/* Add Marks Form + Prediction */}
        <div className="grid-2 section">
          <SemesterForm
            studentId={student.id}
            existingMarks={marks}
            onMarksUpdated={fetchData}
          />
          <PredictionCard marks={marks} />
        </div>

        {/* Charts */}
        {marks.length > 0 && (
          <div className="grid-2 section fade-in">
            <PerformanceLineChart marks={marks} />
            <PerformanceBarChart marks={marks} />
          </div>
        )}

        {/* Marks Table */}
        {marks.length > 0 && (
          <div className="card section fade-in">
            <div className="card-header">
              <div className="card-title">
                <div className="card-icon orange">📋</div>
                Semester-wise Marks
              </div>
            </div>
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedMarks.map((m) => {
                  const v = parseFloat(m.marks);
                  const grade = v >= 90 ? 'A+' : v >= 80 ? 'A' : v >= 70 ? 'B+' : v >= 60 ? 'B' : v >= 50 ? 'C' : v >= 40 ? 'D' : 'F';
                  return (
                    <tr key={m.id}>
                      <td>Semester {m.semester}</td>
                      <td>
                        <span className={`marks-badge ${getMarksBadge(m.marks)}`}>
                          {parseFloat(m.marks).toFixed(2)}%
                        </span>
                      </td>
                      <td>{grade}</td>
                      <td>{v >= 40 ? '✅ Pass' : '❌ Fail'}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteMark(m.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </>
  );
}
