import React, { useEffect, useState } from 'react';

function Courses({ searchTerm }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/timetable')
      .then(res => {
        if (!res.ok) {
          throw new Error('네트워크 응답이 이상해요');
        }
        return res.json();
      })
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  let filteredCourses = [];
    if (searchTerm.trim().toLowerCase() === '빈 강의실') {
      const today = getCurrentDayKey(); // 예: 'monday'
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      filteredCourses = courses.filter(course => {
        const subject = course[today];

        // 오늘 수업이 없으면 → 빈 강의실
        if (!subject || subject === '-' || subject === null) {
          return true;
        }

        // 수업이 있는데 시간 정보가 없으면 → 일단 사용 중으로 간주
        if (!course.start_time || !course.end_time) return false;

        // 수업 시간이 현재 시간과 겹치는지 확인
        const [sh, sm] = course.start_time.split(':').map(Number);
        const [eh, em] = course.end_time.split(':').map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        return nowMinutes < startMinutes || nowMinutes >= endMinutes;
      });
    } else {
      filteredCourses = !searchTerm.trim()
        ? courses
        : courses.filter(course => {
            const combined = Object.values(course)
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return combined.includes(searchTerm.toLowerCase());
          });
    }

  return (
    <div>
      <h2>시간표 목록</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>강의실</th>
            <th>교시</th>
            <th>시작 시간</th>
            <th>종료 시간</th>
            <th>월요일</th>
            <th>화요일</th>
            <th>수요일</th>
            <th>목요일</th>
            <th>금요일</th>
            <th>토요일</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, idx) => (
            <tr key={idx}>
              <td>{course.room}</td>
              <td>{course.period}</td>
              <td>{course.start_time}</td>
              <td>{course.end_time}</td>
              <td>{course.monday || '-'}</td>
              <td>{course.tuesday || '-'}</td>
              <td>{course.wednesday || '-'}</td>
              <td>{course.thursday || '-'}</td>
              <td>{course.friday || '-'}</td>
              <td>{course.saturday || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;
