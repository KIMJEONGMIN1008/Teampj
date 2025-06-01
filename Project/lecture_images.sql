-- 강의 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS lecture_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecture_code VARCHAR(10),
  lecture_name VARCHAR(255),
  image_path VARCHAR(255),
  image_name VARCHAR(100),
  image_type VARCHAR(20),
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT
) CHARACTER SET utf8mb4;

-- 강의 이미지 데이터 삽입
-- 주요 강의들에 대한 이미지 정보
INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('4538', '지능형반도체소자', '/images/lectures/4538/', 'semiconductor_device.jpg', 'jpg', '지능형반도체소자 강의 이미지');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2777', '종합설계', '/images/lectures/2777/', 'design_project.jpg', 'jpg', '종합설계 프로젝트 이미지');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2778', '종합설계', '/images/lectures/2778/', 'design_project2.jpg', 'jpg', '종합설계 수업 장면');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2765', '종합설계', '/images/lectures/2765/', 'capstone_design.jpg', 'jpg', '종합설계 과제 이미지');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2688', '머신러닝', '/images/lectures/2688/', 'machine_learning.jpg', 'jpg', '머신러닝 알고리즘 예시');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2693', '컴퓨터비전응용', '/images/lectures/2693/', 'computer_vision.jpg', 'jpg', '컴퓨터비전 처리 예시');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('4541', '연구설계(1)', '/images/lectures/4541/', 'research_design.jpg', 'jpg', '연구설계 과정 이미지');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2685', '크리에이티브디자인', '/images/lectures/2685/', 'creative_design.jpg', 'jpg', '크리에이티브디자인 작품');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('4528', '반도체공정', '/images/lectures/4528/', 'semiconductor_process.jpg', 'jpg', '반도체공정 과정 이미지');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2821', '컴퓨터구조', '/images/lectures/2821/', 'computer_architecture.jpg', 'jpg', '컴퓨터구조 다이어그램');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2804', '자료구조', '/images/lectures/2804/', 'data_structure.jpg', 'jpg', '자료구조 개념도');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('1593', '빅컨셉+', '/images/lectures/1593/', 'big_concept.jpg', 'jpg', '빅컨셉+ 수업 장면');

-- 프로그래밍 관련 강의 이미지
INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2805', '파이썬프로그래밍', '/images/lectures/2805/', 'python_programming.jpg', 'jpg', '파이썬 코드 예시');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2806', '파이썬프로그래밍', '/images/lectures/2806/', 'python_class.jpg', 'jpg', '파이썬 수업 장면');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2822', '웹프로그래밍', '/images/lectures/2822/', 'web_programming.jpg', 'jpg', '웹 개발 화면');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2837', 'SW개발기초', '/images/lectures/2837/', 'sw_development.jpg', 'jpg', '소프트웨어 개발 과정');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2839', 'C프로그래밍', '/images/lectures/2839/', 'c_programming.jpg', 'jpg', 'C 코드 예시');

INSERT INTO lecture_images (lecture_code, lecture_name, image_path, image_name, image_type, description) 
VALUES ('2840', 'C프로그래밍', '/images/lectures/2840/', 'c_programming_class.jpg', 'jpg', 'C 프로그래밍 수업');

-- 강의 추가 자료 테이블
CREATE TABLE IF NOT EXISTS lecture_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecture_code VARCHAR(10),
  lecture_name VARCHAR(255),
  material_type ENUM('syllabus', 'slides', 'exercise', 'video', 'other'),
  file_path VARCHAR(255),
  file_name VARCHAR(100),
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT
) CHARACTER SET utf8mb4;

-- 강의 자료 삽입 예시
INSERT INTO lecture_materials (lecture_code, lecture_name, material_type, file_path, file_name, description) 
VALUES ('4538', '지능형반도체소자', 'syllabus', '/materials/4538/', 'syllabus.pdf', '강의계획서');

INSERT INTO lecture_materials (lecture_code, lecture_name, material_type, file_path, file_name, description) 
VALUES ('2688', '머신러닝', 'slides', '/materials/2688/', 'machine_learning_intro.pdf', '머신러닝 개요 슬라이드');

INSERT INTO lecture_materials (lecture_code, lecture_name, material_type, file_path, file_name, description) 
VALUES ('2693', '컴퓨터비전응용', 'exercise', '/materials/2693/', 'vision_practice.zip', '컴퓨터비전 실습자료');

INSERT INTO lecture_materials (lecture_code, lecture_name, material_type, file_path, file_name, description) 
VALUES ('2805', '파이썬프로그래밍', 'video', '/materials/2805/', 'python_intro.mp4', '파이썬 소개 동영상');

INSERT INTO lecture_materials (lecture_code, lecture_name, material_type, file_path, file_name, description) 
VALUES ('2804', '자료구조', 'slides', '/materials/2804/', 'data_structure_basics.pdf', '자료구조 기초 슬라이드');
