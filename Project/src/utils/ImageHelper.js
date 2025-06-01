/**
 * 이미지 경로 헬퍼 유틸리티
 * 서버 API에서 제공하는 이미지 경로와 프론트엔드에서 사용하는 이미지 경로 간 변환을 처리합니다.
 */

/**
 * 이미지 경로를 검증하고 적절한 형식으로 변환합니다.
 * @param {string} imagePath 원본 이미지 경로
 * @param {string} defaultImage 기본 이미지 경로 (이미지가 없을 때 사용)
 * @returns {string} 변환된 이미지 경로
 */
export const getValidImagePath = (imagePath, defaultImage = '/build/default-room.png') => {
  if (!imagePath) return defaultImage;
  
  // SQL DB에서 가져온 경로를 적절히 변환
  if (imagePath.startsWith('/project/class/')) {
    // 프로젝트 내 이미지 경로를 public 폴더 내 위치로 변환
    return imagePath;
  }
  
  return imagePath;
};

/**
 * 강의실 번호와 이미지 타입에 따라 이미지 경로를 생성합니다.
 * @param {string} roomNumber 강의실 번호 (예: "7205")
 * @param {string} type 이미지 타입 ("in" 또는 "out")
 * @returns {string} 생성된 이미지 경로
 */
export const getClassroomImagePath = (roomNumber, type = 'out') => {
  if (!roomNumber) return null;
  
  // 강의실 번호와 타입으로 파일명 생성
  const validType = type.toLowerCase() === 'in' ? 'in' : 'out';
  return `/project/class/${roomNumber}_${validType}.jpg`;
};

/**
 * 강의실 번호에 대한 이미지 목록을 생성합니다.
 * @param {string} roomNumber 강의실 번호 (예: "7205")
 * @returns {Array} 이미지 객체 배열 [{path, type, description}]
 */
export const generateClassroomImages = (roomNumber) => {
  if (!roomNumber) return [];
  
  return [
    {
      path: getClassroomImagePath(roomNumber, 'in'),
      type: '내부',
      description: `${roomNumber}호 내부`
    },
    {
      path: getClassroomImagePath(roomNumber, 'out'),
      type: '외부',
      description: `${roomNumber}호 외부`
    }
  ];
};
