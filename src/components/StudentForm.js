'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function StudentForm({ onStudentAdded }) {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{ name: name.trim(), roll_no: rollNo.trim() }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          showToast('A student with this roll number already exists!', 'error');
        } else {
          showToast(error.message, 'error');
        }
        return;
      }

      setName('');
      setRollNo('');
      showToast('Student registered successfully! 🎉');
      if (onStudentAdded) onStudentAdded(data);
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon purple">🎓</div>
            Register New Student
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="student-name">Full Name</label>
              <input
                id="student-name"
                className="form-input"
                type="text"
                placeholder="e.g. Vedant Shimpi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="roll-no">Roll Number</label>
              <input
                id="roll-no"
                className="form-input"
                type="text"
                placeholder="e.g. CS2024001"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? '⏳ Registering...' : '✨ Register Student'}
          </button>
        </form>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </>
  );
}
