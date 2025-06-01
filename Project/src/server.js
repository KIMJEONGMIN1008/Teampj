const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000; // 서버 포트

// CORS 설정 추가
app.use(cors());

// JSON 파싱 미들웨어 추가
app.use(express.json());

// 정적 파일 서빙 설정 추가
app.use('/class', express.static(path.join(__dirname, '../class')));
app.use('/build', express.static(path.join(__dirname, '../public/build')));
app.use('/png', express.static(path.join(__dirname, '../public/png')));

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

// 빈 강의실 조회 API
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

// 강의실 이미지 조회 API 수정
app.get('/api/classroom-images/:room', (req, res) => {
  const roomId = req.params.room;
  
  // 실제 존재하는 파일 기반으로 응답 생성
  try {
    const images = [];
    const roomNumber = roomId;
    
    // 이미지 파일 목록 (실제 폴더에 있는 파일 기준)
    const existingOuterImages = [
      '7205', '7206', '7207', '7307', '7418', 
      '7605', '7615', '7705B', '7706', '7714'
    ];
    
    const existingInnerImages = [
      '7307', '7418', '7615', '7705B', '7706'
    ];
    
    // 외부 이미지가 있으면 추가
    if (existingOuterImages.includes(roomNumber)) {
      images.push({
        room: roomNumber,
        description: '외부',
        type: '외부',
        image_name: `${roomNumber}out.jpg`,
        full_path: `/class/${roomNumber}out.jpg`,
        path: `/class/${roomNumber}out.jpg`
      });
    }
    
    // 내부 이미지가 있으면 추가
    if (existingInnerImages.includes(roomNumber)) {
      images.push({
        room: roomNumber,
        description: '내부',
        type: '내부',
        image_name: `${roomNumber}in.jpg`,
        full_path: `/class/${roomNumber}in.jpg`,
        path: `/class/${roomNumber}in.jpg`
      });
    }
    
    res.json(images);
  } catch (error) {
    console.error('이미지 경로 처리 오류:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 강의실 세부 정보 조회 API 추가
app.get('/api/classroom-details/:room', (req, res) => {
  const roomId = req.params.room;
  
  const queries = {
    images: 'SELECT * FROM classroom_images WHERE room = ?',
    seats: 'SELECT * FROM classroom_seats WHERE room = ?',
    facilities: 'SELECT * FROM classroom_facilities WHERE room = ?'
  };
  
  const data = {};
  
  // 이미지 정보 조회
  db.query(queries.images, [roomId], (err, images) => {
    if (err) {
      console.error('강의실 이미지 조회 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }
    
    data.images = images.map(img => ({
      ...img,
      full_path: `${img.image_path}${img.image_name}`,
      type: img.description.includes('내부') ? '내부' : '외부'
    }));
    
    // 좌석 정보 조회
    db.query(queries.seats, [roomId], (err, seats) => {
      if (err) {
        console.error('강의실 좌석 조회 오류:', err);
        return res.status(500).json({ error: '서버 오류' });
      }
      
      data.seats = seats[0] || null;
      
      // 시설 정보 조회
      db.query(queries.facilities, [roomId], (err, facilities) => {
        if (err) {
          console.error('강의실 시설 조회 오류:', err);
          return res.status(500).json({ error: '서버 오류' });
        }
        
        data.facilities = facilities[0] || null;
        
        res.json(data);
      });
    });
  });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});