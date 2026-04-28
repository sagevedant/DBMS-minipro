'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SemesterForm({ studentId, existingMarks, onMarksUpdated }) {
  const [semester, setSemester] = useState('');
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const existingSemesters = existingMarks.map(m => m.semester);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sem = parseInt(semester);
    const marksVal = parseFloat(marks);

    if (!sem || isNaN(marksVal) || marksVal < 0 || marksVal > 100) {
      showToast('Please enter valid semester and marks (0–100)', 'error');
      return;
    }

    setLoading(true);
    try {
      // Check if semester already exists — update instead of insert
      const existing = existingMarks.find(m => m.semester === sem);
      let result;

      if (existing) {
        result = await supabase
          .from('semester_marks')
          .update({ marks: marksVal })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('semester_marks')
          .insert([{ student_id: studentId, semester: sem, marks: marksVal }])
          .select()
          .single();
      }

      if (result.error) {
        showToast(result.error.message, 'error');
        return;
      }

      setSemester('');
      setMarks('');
      showToast(existing ? 'Marks updated! 📝' : 'Marks added! 🎉');
      if (onMarksUpdated) onMarksUpdated();
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon purple">📝</div>
            Add / Update Marks
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="semester-select">Semester</label>
              <select
                id="semester-select"
                className="form-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s} {existingSemesters.includes(s) ? '(update)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="marks-input">Marks (0–100)</label>
              <input
                id="marks-input"
                className="form-input"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.5"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save Marks'}
          </button>
        </form>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </>
  );
}
