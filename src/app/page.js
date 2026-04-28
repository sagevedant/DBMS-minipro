'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStudentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Hero */}
        <div className="hero">
          <h1>
            Student <span>Performance</span><br />Tracker
          </h1>
          <p>
            Track semester marks, visualize performance with beautiful charts,
            and predict future scores using the Law of Averages.
          </p>
        </div>

        {/* Registration Form */}
        <div className="section">
          <StudentForm onStudentAdded={handleStudentAdded} />
        </div>

        {/* Student List */}
        <StudentList refreshKey={refreshKey} />
      </div>
    </>
  );
}
