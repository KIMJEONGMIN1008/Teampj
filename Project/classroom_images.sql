-- 강의실 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS classroom_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room VARCHAR(10),
  image_path VARCHAR(255),
  image_name VARCHAR(100),
  image_type VARCHAR(20),
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT
) CHARACTER SET utf8mb4;

-- 각 강의실별 이미지 데이터 삽입
-- 7102A호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7102A', '/project/class/', '7102A_in.jpg', 'jpg', '7102A호 강당 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7102A', '/project/class/', '7102A_out.jpg', 'jpg', '7102A호 강당 외부');

-- 7205호 강의실 이미지 (수정됨)
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7205', '/project/class/', '7205_in.jpg', 'jpg', '7205호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7205', '/project/class/', '7205_out.jpg', 'jpg', '7205호 강의실 외부');

-- 7206호 강의실 이미지 (수정됨)
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7206', '/project/class/', '7206_in.jpg', 'jpg', '7206호 자동제어실험실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7206', '/project/class/', '7206_out.jpg', 'jpg', '7206호 자동제어실험실 외부');

-- 7207호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7207', '/project/class/', '7207_in.jpg', 'jpg', '7207호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7207', '/project/class/', '7207_out.jpg', 'jpg', '7207호 강의실 외부');

-- 7306호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7306', '/project/class/', '7306_in.jpg', 'jpg', '7306호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7306', '/project/class/', '7306_out.jpg', 'jpg', '7306호 강의실 외부');

-- 7307호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7307', '/project/class/', '7307_in.jpg', 'jpg', '7307호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7307', '/project/class/', '7307_out.jpg', 'jpg', '7307호 강의실 외부');

-- 7405호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7405', '/project/class/', '7405_in.jpg', 'jpg', '7405호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7405', '/project/class/', '7405_out.jpg', 'jpg', '7405호 강의실 외부');

-- 7406호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7406', '/project/class/', '7406_in.jpg', 'jpg', '7406호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7406', '/project/class/', '7406_out.jpg', 'jpg', '7406호 강의실 외부');

-- 7409호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7409', '/project/class/', '7409_in.jpg', 'jpg', '7409호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7409', '/project/class/', '7409_out.jpg', 'jpg', '7409호 강의실 외부');

-- 7418호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7418', '/project/class/', '7418_in.jpg', 'jpg', '7418호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7418', '/project/class/', '7418_out.jpg', 'jpg', '7418호 강의실 외부');

-- 7506호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7506', '/project/class/', '7506_in.jpg', 'jpg', '7506호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7506', '/project/class/', '7506_out.jpg', 'jpg', '7506호 강의실 외부');

-- 7507A호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7507A', '/project/class/', '7507A_in.jpg', 'jpg', '7507A호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7507A', '/project/class/', '7507A_out.jpg', 'jpg', '7507A호 강의실 외부');

-- 7507B호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7507B', '/project/class/', '7507B_in.jpg', 'jpg', '7507B호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7507B', '/project/class/', '7507B_out.jpg', 'jpg', '7507B호 강의실 외부');

-- 7514호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7514', '/project/class/', '7514_in.jpg', 'jpg', '7514호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7514', '/project/class/', '7514_out.jpg', 'jpg', '7514호 강의실 외부');

-- 7605호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7605', '/project/class/', '7605_in.jpg', 'jpg', '7605호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7605', '/project/class/', '7605_out.jpg', 'jpg', '7605호 강의실 외부');

-- 7606호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7606', '/project/class/', '7606_in.jpg', 'jpg', '7606호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7606', '/project/class/', '7606_out.jpg', 'jpg', '7606호 강의실 외부');

-- 7607호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7607', '/project/class/', '7607_in.jpg', 'jpg', '7607호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7607', '/project/class/', '7607_out.jpg', 'jpg', '7607호 강의실 외부');

-- 7615호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7615', '/project/class/', '7615_in.jpg', 'jpg', '7615호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7615', '/project/class/', '7615_out.jpg', 'jpg', '7615호 강의실 외부');

-- 7705A호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7705A', '/project/class/', '7705A_in.jpg', 'jpg', '7705A호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7705A', '/project/class/', '7705A_out.jpg', 'jpg', '7705A호 강의실 외부');

-- 7705B호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7705B', '/project/class/', '7705B_in.jpg', 'jpg', '7705B호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7705B', '/project/class/', '7705B_out.jpg', 'jpg', '7705B호 강의실 외부');

-- 7706호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7706', '/project/class/', '7706_in.jpg', 'jpg', '7706호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7706', '/project/class/', '7706_out.jpg', 'jpg', '7706호 강의실 외부');

-- 7707호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7707', '/project/class/', '7707_in.jpg', 'jpg', '7707호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7707', '/project/class/', '7707_out.jpg', 'jpg', '7707호 강의실 외부');

-- 7714호 강의실 이미지
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7714', '/project/class/', '7714_in.jpg', 'jpg', '7714호 강의실 내부');
INSERT INTO classroom_images (room, image_path, image_name, image_type, description) 
VALUES ('7714', '/project/class/', '7714_out.jpg', 'jpg', '7714호 강의실 외부');

-- 강의실 좌석 정보 테이블 생성
CREATE TABLE IF NOT EXISTS classroom_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room VARCHAR(10),
  seat_count INT,
  seat_arrangement VARCHAR(20),
  has_computers BOOLEAN,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4;

-- 강의실 좌석 정보 삽입
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7205', 40, '교실형', false);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7206', 30, '실험실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7307', 45, '교실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7405', 50, '계단식', false);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7406', 40, '교실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7409', 35, '교실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7418', 40, '교실형', false);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7506', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7507A', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7507B', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7514', 45, '교실형', false);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7605', 35, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7606', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7615', 45, '교실형', false);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7705A', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7705B', 30, '실습실형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7706', 40, '프로젝트형', true);
INSERT INTO classroom_seats (room, seat_count, seat_arrangement, has_computers) 
VALUES ('7714', 45, '교실형', false);

-- 강의실 설비 정보 테이블 생성
CREATE TABLE IF NOT EXISTS classroom_facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room VARCHAR(10),
  has_projector BOOLEAN DEFAULT false,
  has_whiteboard BOOLEAN DEFAULT false,
  has_speakers BOOLEAN DEFAULT false,
  has_airconditioner BOOLEAN DEFAULT false,
  has_wifi BOOLEAN DEFAULT false,
  has_special_equipment TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4;

-- 강의실 설비 정보 삽입
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7205', true, true, true, true, true, NULL);
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7206', true, true, true, true, true, '자동제어 실험 장비');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7307', true, true, true, true, true, '머신러닝 워크스테이션');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7405', true, true, true, true, true, NULL);
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7406', true, true, true, true, true, '파이썬 개발 환경');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7409', true, true, true, true, true, '클라우드 컴퓨팅 서버');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7418', true, true, true, true, true, NULL);
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7506', true, true, true, true, true, '시스템 프로그래밍 환경');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7507A', true, true, true, true, true, '정보보호 테스트베드');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7507B', true, true, true, true, true, 'C 프로그래밍 환경');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7514', true, true, true, true, true, NULL);
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7605', true, true, true, true, true, '게임 개발 환경');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7606', true, true, true, true, true, '네트워크 보안 장비');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7615', true, true, true, true, true, 'IoT 장비');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7705A', true, true, true, true, true, '악성코드 분석 워크스테이션');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7705B', true, true, true, true, true, '모의해킹 환경');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7706', true, true, true, true, true, '종합설계 워크스테이션');
INSERT INTO classroom_facilities (room, has_projector, has_whiteboard, has_speakers, has_airconditioner, has_wifi, has_special_equipment) 
VALUES ('7714', true, true, true, true, true, NULL);
