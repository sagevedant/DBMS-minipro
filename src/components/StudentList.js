'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function StudentList({ refreshKey }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setStudents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [refreshKey]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this student and all their marks?')) return;

    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete student', 'error');
    } else {
      showToast('Student deleted successfully');
      fetchStudents();
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section fade-in">
      <div className="section-header">
        <div>
          <h2 className="section-title">📋 All Students</h2>
          <p className="section-subtitle">{students.length} student{students.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>

      {students.length > 0 && (
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <p>{students.length === 0 ? 'No students registered yet. Add your first student above!' : 'No students match your search.'}</p>
        </div>
      ) : (
        <div className="student-grid">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="student-card"
              onClick={() => router.push(`/report/${student.id}`)}
            >
              <div className="student-avatar">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="student-info">
                <div className="student-name">{student.name}</div>
                <div className="student-roll">Roll No: {student.roll_no}</div>
              </div>
              <div className="student-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => { e.stopPropagation(); router.push(`/report/${student.id}`); }}
                >
                  📈 Report
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => handleDelete(e, student.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
