const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000; // 서버 포트

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // 실제 비밀번호로 변경
  database: 'your_database_name', // 실제 DB 이름으로 변경
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err.stack);
    return;
  }
  console.log('MySQL 연결 성공');
});

// timetable 데이터를 가져오는 API
app.get('/schedule', (req, res) => {
  db.query('SELECT * FROM timetable', (err, results) => {
    if (err) {
      res.status(500).send('DB 오류');
      return;
    }
    res.json(results); // 데이터 반환
  });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});

app.get('/api/empty-rooms', (req, res) => {
  const { day, period } = req.query;

  if (!day || !period) {
    return res.status(400).json({ error: '필요한 파라미터가 없습니다.' });
  }

  const sql = `SELECT DISTINCT room FROM timetable WHERE \`${day}\` IS NULL AND period = ?`;

  db.query(sql, [period], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }

    res.json(results);
  });
});