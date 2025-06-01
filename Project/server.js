import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

async function main() {
  const app = express();
  const port = 3001;

  app.use(cors());
  app.use(express.json());

  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rlawjdals1028!@',
    database: 'timetable',
  });

  app.get('/api/timetable', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM timetable');
      res.json(rows);
    } catch (err) {
      console.error('DB 조회 에러:', err);
      res.status(500).send('DB 조회 실패');
    }
  });

  app.get('/api/timetable', async (req, res) => {
    const { room } = req.query;

    if (!room) {
      return res.status(400).send('room 쿼리 파라미터가 필요합니다.');
    }

    try {
      const [rows] = await db.execute('SELECT * FROM timetable WHERE room = ?', [room]);

      // 결과를 baseScheduleTemplate 구조로 가공
      const formatted = rows.map(row => ({
        period: row.period,
        time: `${row.start_time.slice(0, 5)}~${row.end_time.slice(0, 5)}`,
        monday: row.monday || '',
        tuesday: row.tuesday || '',
        wednesday: row.wednesday || '',
        thursday: row.thursday || '',
        friday: row.friday || '',
        saturday: row.saturday || ''
      }));

      res.json(formatted);
    } catch (err) {
      console.error('DB 조회 에러:', err);
      res.status(500).send('DB 조회 실패');
    }
  });

  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

main().catch(err => {
  console.error('서버 실행 중 에러:', err);
});
