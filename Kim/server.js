// SQL 서버
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 5000;

// MySQL 데이터베이스 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // 본인 DB 비밀번호
  database: 'your_database_name',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// API 엔드포인트 생성
app.get('/get-data', (req, res) => {
  db.query('SELECT * FROM your_table_name', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Database query failed');
    } else {
      res.json(results); // SQL 결과를 JSON 형식으로 반환
    }
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
