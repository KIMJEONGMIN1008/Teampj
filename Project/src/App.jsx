import React, { useState, useEffect } from 'react';
import CampusMap from './components/map';
import VoiceSearch from './components/voicesearch';
import Courses from './components/courses';
import './App.css';
import { buildingInfo } from './components/building_data';

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [resetTerm, setResetTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]); // 연관검색어 후보
  const [showSuggestions, setShowSuggestions] = useState(false); // 후보 표시 여부

  const [allSuggestions, setAllSuggestions] = useState([]);

  const [roomPopupData, setRoomPopupData] = useState(null);       // 강의실 팝업 상태
  const [lecturePopupData, setLecturePopupData] = useState(null);
  const [emptyRoomsPopupData, setEmptyRoomsPopupData] = useState(null);

  const [courses, setCourses] = useState([]);
  const [colorMap, setColorMap] = React.useState({});

  const [showRoomImage, setShowRoomImage] = useState(false);
  const [roomImages, setRoomImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [selectedBuildingName, setSelectedBuildingName] = useState('');

  // 이미지 관련 상태 추가
  const [showRoomImageGallery, setShowRoomImageGallery] = useState(false);

  function getRandomColor() {
    const r = Math.floor(50 + Math.random() * 150);
    const g = Math.floor(50 + Math.random() * 150);
    const b = Math.floor(50 + Math.random() * 150);
    return `rgb(${r},${g},${b}, 0.3)`;
  }

  const findBuildingByRoom = (roomName) => {
    for (const [buildingName, buildingData] of Object.entries(buildingInfo)) {
      if (buildingData.floors) {
        for (const rooms of Object.values(buildingData.floors)) {
          if (rooms.includes(roomName)) {
            return buildingName;
          }
        }
      }
    }
    return null; // 없으면 null 반환
  };

  useEffect(() => {
    if (resetTerm) {
      setResetTerm(false); // 한 번만 초기화
    }
  }, [resetTerm]);

  useEffect(() => {
    if (!roomPopupData?.schedule) {
      setColorMap({});
      return;
    }

    const newMap = {};
    roomPopupData.schedule.forEach(entry => {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
        const subject = entry[day];
        if (subject && !newMap[subject]) {  // day 제거하고 subject만 key로 사용
          newMap[subject] = getRandomColor();
        }
      });
    });
    setColorMap(newMap);
  }, [roomPopupData, emptyRoomsPopupData]);

  useEffect(() => {
    fetch('http://localhost:3001/api/timetable')
      .then(res => res.json())
      .then(data => {
        setCourses(data);

        const rawSuggestions = data.flatMap(course =>
          [
            course.room,
            course.monday,
            course.tuesday,
            course.wednesday,
            course.thursday,
            course.friday,
            course.saturday
          ]
        ).filter(Boolean);

        const cleanedSuggestions = rawSuggestions
          .map(s => typeof s === 'string' ? s.trim() : s)
          .filter(s => s.length > 0);

        const uniqueSuggestions = [...new Set(cleanedSuggestions)];
        setAllSuggestions(uniqueSuggestions);
      })
      .catch(err => {
        console.error('데이터 불러오기 실패:', err);
        setCourses([]);
        setAllSuggestions([]);
      });
  }, []);

  // 입력 변경 시 연관검색어 필터링 및 표시 제어
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

      if (value.trim().length > 0) {
        const filtered = [...new Set(
          allSuggestions
            .filter(s => typeof s === 'string') // 안전하게 문자열만 필터
            .filter(s => s.toLowerCase().includes(value.toLowerCase()))
        )];
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      console.log(allSuggestions)
      console.log(suggestions)
    };
    
  const handleSuggestionClick = (item) => {
    setSearchTerm(item);
    setShowSuggestions(false);
    showPopupForTerm(item); // 공통 함수로 팝업 처리
  };

  const handleSearchEnter = () => {
    const item = searchTerm.trim();
    if (!item) return;
    console.log('검색어:', item);

    if (item === '빈강의실' || item === '빈 강의실') {
      showEmptyRoomsPopup();
      setShowSuggestions(false);
      return;
    }

    showPopupForTerm(item);

    const roomCourses = courses.filter(course =>
      course.room?.toLowerCase().trim() === item.toLowerCase()
    );

    if (roomCourses.length > 0) {
      const groupedByPeriod = roomCourses.map(course => ({
        period: course.period,
        start_time: course.start_time,
        end_time: course.end_time,
        monday: course.monday,
        tuesday: course.tuesday,
        wednesday: course.wednesday,
        thursday: course.thursday,
        friday: course.friday,
        saturday: course.saturday,
      }));

      setRoomPopupData({
        type: 'room',
        building: selectedBuildingName,
        room: item,
        schedule: groupedByPeriod,
      });
      setEmptyRoomsPopupData(null);
    } else {
      alert(`"${item}" 강의실 정보를 찾을 수 없습니다.`);
      setRoomPopupData(null);
    }
  };

  const showEmptyRoomsPopup = () => {
    console.log('빈 강의실 검색 실행');
    const now = new Date();

    const daysKorean = ['일', '월', '화', '수', '목', '금', '토'];
    const today = daysKorean[now.getDay()];

    const pad = (num) => num.toString().padStart(2, '0');
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const emptyRooms = [];

    const rooms = [...new Set(courses.map(c => c.room).filter(r => r))];

    rooms.forEach(room => {
      const todayCourses = courses.filter(c => c.room === room);

      let occupied = false;

      for (const course of todayCourses) {
        const subject = course[today];

        if (subject) {
          if (course.start_time <= currentTime && currentTime < course.end_time) {
            occupied = true;
            break;
          }
        }
      }

      if (!occupied) {
        emptyRooms.push(room);
      }
    });

    if (emptyRooms.length === 0) {
      alert('현재 비어있는 강의실이 없습니다.');
      setRoomPopupData(null);
      return;
    }

    console.log('빈강의실 목록:', emptyRooms);

    setEmptyRoomsPopupData({
      rooms: emptyRooms,
      timestamp: currentTime,
      day: today,
    });
    setRoomPopupData(null);
  };

  const showPopupForTerm = (term) => {
    const trimmedTerm = term?.trim();
    if (!trimmedTerm) {
      setRoomPopupData(null);
      return;
    }

    let foundBuilding = null;
    for (const [bName, bData] of Object.entries(buildingInfo)) {
      if (Object.values(bData.floors).flat().includes(trimmedTerm)) {
        foundBuilding = bName;
        break;
      }
    }

    const roomCourses = courses.filter(course =>
      course.room?.toLowerCase().trim() === trimmedTerm.toLowerCase()
    );

    if (roomCourses.length > 0) {
      const groupedByPeriod = roomCourses.map(course => ({
        period: course.period,
        start_time: course.start_time,
        end_time: course.end_time,
        monday: course.monday,
        tuesday: course.tuesday,
        wednesday: course.wednesday,
        thursday: course.thursday,
        friday: course.friday,
        saturday: course.saturday,
      }));

      setRoomPopupData({
        building: foundBuilding,
        room: trimmedTerm,
        schedule: groupedByPeriod,
      });
      setEmptyRoomsPopupData(null);
    } else {
      alert(`"${term}" 강의실 정보를 찾을 수 없습니다.`);
      setRoomPopupData(null);
    }
  };
  
  // 이미지 경로 유효성 확인 및 기본 이미지 제공하는 함수 개선
  const getValidImagePath = (imagePath) => {
    // 기본 이미지 경로 (이미지가 없을 때 사용)
    const defaultImage = '/build/default-room.png';
    
    if (!imagePath) return defaultImage;
    
    // 이미지 경로 확인 및 수정
    // class 폴더에 있는 이미지 파일로 직접 매핑
    if (imagePath.includes('/class/')) {
      // 이미지 경로가 올바르게 지정되었는지 확인
      return imagePath;
    }
    
    // 이미지 경로가 roomNumber + in/out 형식인지 확인
    const match = imagePath.match(/(\d+[A-Z]*)(?:in|out)\.jpg$/);
    if (match) {
      const roomNumber = match[1];
      const isInner = imagePath.includes('in.jpg');
      return `/class/${roomNumber}${isInner ? 'in' : 'out'}.jpg`;
    }
    
    return defaultImage;
  };

  // 강의실 이미지 API에서 가져오기
  const fetchRoomImages = async (roomName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/classroom-images/${roomName}`);
      if (!response.ok) {
        throw new Error('이미지 데이터를 불러오는데 실패했습니다');
      }
      const data = await response.json();
      
      // API 결과를 roomImages 형식에 맞게 변환
      const formattedImages = data.map(img => ({
        path: img.full_path,
        type: img.type,
        description: img.description
      }));
      
      return formattedImages;
    } catch (error) {
      console.error('강의실 이미지 불러오기 오류:', error);
      return [];
    }
  };

  // 강의실 세부 정보 API에서 가져오기
  const fetchRoomDetails = async (roomName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/classroom-details/${roomName}`);
      if (!response.ok) {
        throw new Error('강의실 세부 정보를 불러오는데 실패했습니다');
      }
      return await response.json();
    } catch (error) {
      console.error('강의실 세부 정보 불러오기 오류:', error);
      return null;
    }
  };

  // 강의실 클릭 함수 수정
  const handleRoomClick = async (roomName, buildingName = '', position = null) => {
    const resolvedBuildingName = buildingName || findBuildingByRoom(roomName) || roomPopupData?.name || '';
    
    console.log('강의실 클릭:', roomName, '건물:', resolvedBuildingName);

    // 강의실 시간표 확인
    const roomCourses = courses.filter(course => course.room === roomName);
    
    // 강의실 이미지 가져오기 (SQL 기반)
    let roomImagesData = [];
    let roomDetailsData = null;
    
    // 이미지 및 세부 정보 API 호출
    if (buildingInfo[resolvedBuildingName]?.roomDetails?.[roomName]?.useAPI) {
      try {
        // 이미지 가져오기
        roomImagesData = await fetchRoomImages(roomName);
        
        // 세부 정보 가져오기
        roomDetailsData = await fetchRoomDetails(roomName);
        console.log('강의실 세부 정보:', roomDetailsData);
      } catch (error) {
        console.error('강의실 데이터 로딩 오류:', error);
      }
    }
    
    // 시간표가 없지만 이미지가 있는 경우, 빈 시간표로 데이터 생성
    if (roomCourses.length === 0) {
      if (roomImagesData.length > 0 || roomDetailsData) {
        // 이미지는 있지만 시간표가 없는 경우
        setRoomPopupData({
          type: 'room',
          building: resolvedBuildingName,
          room: roomName,
          schedule: [], // 빈 시간표
          position: position || { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          imagesOnly: true, // 이미지만 있음을 표시
          details: roomDetailsData // 세부 정보 추가
        });
        
        // 이미지 설정
        setRoomImages(roomImagesData);
        setSelectedImageIndex(0);
        setLecturePopupData(null);
        return;
      } else {
        // 이미지도 없고 시간표도 없는 경우
        alert(`"${roomName}" 강의실 정보를 찾을 수 없습니다.`);
        return;
      }
    }

    // 시간표가 있는 경우
    const groupedByPeriod = roomCourses.map(course => ({
      period: course.period,
      start_time: course.start_time,
      end_time: course.end_time,
      monday: course.monday,
      tuesday: course.tuesday,
      wednesday: course.wednesday,
      thursday: course.thursday,
      friday: course.friday,
      saturday: course.saturday,
    }));

    setRoomPopupData({
      type: 'room',
      building: resolvedBuildingName,
      room: roomName,
      schedule: groupedByPeriod,
      position: position || { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      details: roomDetailsData // 세부 정보 추가
    });

    // 이미지 설정
    setRoomImages(roomImagesData);
    setSelectedImageIndex(0);
    setLecturePopupData(null);
  };
  
  // 층 정보의 강의실 클릭 처리 함수 개선
const handleFloorRoomClick = async (room) => {
  try {
    const buildingName = lecturePopupData.name;
    
    console.log(`클릭한 강의실: ${room}, 건물: ${buildingName}`);
    
    // 강의실 이미지 가져오기
    let images = await fetchRoomImages(room);
    
    // 이미지가 없으면 기본 이미지 생성 (외부 이미지)
    if (images.length === 0) {
      console.log(`${room} 강의실 이미지가 없어 기본 이미지 생성`);
      
      // 외부 이미지는 항상 추가
      images = [{
        path: `/class/${room}out.jpg`,
        type: '외부',
        description: '외부'
      }];
      
      // 내부 이미지가 있는 강의실 목록 (class 폴더 확인 기준)
      // 폴더에 실제로 있는 파일 목록만 포함
      const roomsWithInnerImage = ['7307', '7418', '7615', '7705B', '7706'];
      
      // 내부 이미지가 있는 강의실이면 내부 이미지도 추가
      if (roomsWithInnerImage.includes(room)) {
        images.push({
          path: `/class/${room}in.jpg`,
          type: '내부',
          description: '내부'
        });
      }
    }
    
    // 이미지 경로 매핑
    const mappedImages = images.map(img => ({
      ...img,
      path: getValidImagePath(img.path || img.full_path)
    }));
    
    console.log('설정된 이미지:', mappedImages);
    setRoomImages(mappedImages);
    
    // 강의실 세부 정보 가져오기
    const details = await fetchRoomDetails(room);
    
    // 기존 강의실 정보 처리 로직과 통합
    const roomCourses = courses.filter(course => course.room === room);
    
    const groupedByPeriod = roomCourses.map(course => ({
      period: course.period,
      start_time: course.start_time,
      end_time: course.end_time,
      monday: course.monday,
      tuesday: course.tuesday,
      wednesday: course.wednesday,
      thursday: course.thursday,
      friday: course.friday,
      saturday: course.saturday,
    }));

    setRoomPopupData({
      type: 'room',
      building: buildingName,
      room: room,
      schedule: groupedByPeriod.length > 0 ? groupedByPeriod : [],
      imagesOnly: groupedByPeriod.length === 0,
      details: details,
      loading: false
    });

    setLecturePopupData(null);
    setSelectedImageIndex(0);
  } catch (error) {
    console.error('강의실 정보 처리 중 오류:', error);
    alert(`${room} 강의실 정보를 불러오는 중 오류가 발생했습니다.`);
  }
};

  // 이미지 이동 함수
  const navigateImage = (direction) => {
    if (roomImages.length === 0) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % roomImages.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    }
  };

  const dedupedSchedule = React.useMemo(() => {
    if (!roomPopupData?.schedule) return [];

    const daySchedule = [];
    const nightSchedule = [];

    roomPopupData.schedule.forEach(item => {
      const hour = parseInt(item.start_time.split(':')[0], 10);
      const timeType = hour >= 18 ? 'night' : 'day';

      if (timeType === 'day') {
        daySchedule.push({ ...item, _timeType: 'day' });
      } else {
        nightSchedule.push({ ...item, _timeType: 'night' });
      }
    });

    daySchedule.sort((a, b) => a.period - b.period);
    nightSchedule.sort((a, b) => a.period - b.period);

    const nightScheduleWithLabels = nightSchedule.map((item, idx) => ({
    ...item,
    period: `N${idx + 1}`

  }));

    return [...daySchedule, ...nightScheduleWithLabels];
  }, [roomPopupData]);

  const toggleNotification = () => {
    setIsNotificationOpen(prev => !prev);
  };

  const addNotification = () => {
    setNotifications(prev => [...prev, '새로운 알림이 도착했습니다!']);
  };

  const handleVoiceSearch = (term) => {
    setSearchTerm(term);
    if (term && term.trim() !== '') {
      showPopupForTerm(term);
    } else {
      // 빈 문자열일 경우 팝업 닫기
      setRoomPopupData(null);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="logo">Campus<br />Guide Map</div>

        <div className={`search-bar ${showSuggestions ? 'expanded' : ''}`}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchEnter();  // 엔터 입력 시
            }}
            className={showSuggestions ? 'expanded' : ''}
          />
          
          <VoiceSearch
            searchTerm={searchTerm}
            setSearchTerm={handleVoiceSearch}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item, idx) => (
                <li key={idx} onMouseDown={() => handleSuggestionClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="icons">
          <img
              src="png/bell.png"
              alt="Notification"
              className="icon-img"
              onClick={toggleNotification}
          />

          {isNotificationOpen && (
            <div className="notification-popup">

              <button
                className="close-notification"
                onClick={() => setIsNotificationOpen(false)}
              >×</button>

              {notifications.length === 0 ? (
                <p>새 알림이 없습니다</p>
              ) : (
                notifications.map((msg, idx) => <div key={idx}>{msg}</div>)
              )}
            </div>
          )}

          <img
            src="png/menubar.png"
            alt="Menu"
            className="icon-img"
            onClick={() => setShowSidebar(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>

      <CampusMap 
        setLecturePopupData={setLecturePopupData}
        setRoomPopupData={setRoomPopupData}
      />

      <Courses searchTerm={searchTerm} />

      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>✖</button>
        <h2>메뉴</h2>
        <ul>
          <li>즐겨찾기</li>
          <li>검색기록</li>
          <li>이용방벙</li>
          <li> 설정 </li>
        </ul>
      </div>
      {showSidebar && <div className="backdrop" onClick={() => setShowSidebar(false)} />}

      {emptyRoomsPopupData && (
        <div className="empty-rooms-popup">
          <button className="close-btn" onClick={() => {
            setEmptyRoomsPopupData(null);
            setResetTerm('');
            }}>X</button>
          <h3>현재 비어있는 강의실 목록</h3>
          <p>기준 시간: {emptyRoomsPopupData.timestamp} ({emptyRoomsPopupData.day})</p>
          <ul>
            {emptyRoomsPopupData.rooms.map((room, idx) => (
              <li key={idx}>
                <span
                  onClick={(e) =>
                    handleRoomClick(
                      room,
                      emptyRoomsPopupData.buildingName && emptyRoomsPopupData.buildingName !== '' 
                      ? emptyRoomsPopupData.buildingName 
                      : null,
                      { x: e.clientX + 20, y: e.clientY - 150 }
                    )
                  }
                  style={{ color: 'black', cursor: 'pointer' }}
                >
                  {room}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {roomPopupData && (
        <>
          <div className="course-popup">
            <button className="close-btn" onClick={() => {
              setRoomPopupData(null);
              setSearchTerm('');
            }}>X</button>
            <h3><strong>강의실:</strong> {roomPopupData.room}</h3>

            {roomPopupData.loading && (
              <div className="loading-indicator">
                <p>강의실 정보를 불러오는 중입니다...</p>
              </div>
            )}

            <div className="room-info">
              <div className="title">강의실 정보</div>
              <div className="room-types"> 강의실 종류: {
                  roomPopupData.building && roomPopupData.room && buildingInfo[roomPopupData.building]?.roomDetails?.[roomPopupData.room]?.type
                    ? buildingInfo[roomPopupData.building].roomDetails[roomPopupData.room].type
                    : '정보 없음' }
              </div>

              {/* 좌석 및 시설 정보 표시 */}
              {roomPopupData.details && (
                <div className="room-details">
                  {roomPopupData.details.seats && (
                    <div className="seat-info">
                      <h4>좌석 정보</h4>
                      <p>총 좌석 수: {roomPopupData.details.seats.seat_count}석</p>
                      <p>좌석 배치: {roomPopupData.details.seats.seat_arrangement}</p>
                      <p>컴퓨터 구비: {roomPopupData.details.seats.has_computers ? '있음' : '없음'}</p>
                    </div>
                  )}
                  
                  {roomPopupData.details.facilities && (
                    <div className="facility-info">
                      <h4>시설 정보</h4>
                      <ul>
                        <li>프로젝터: {roomPopupData.details.facilities.has_projector ? '있음' : '없음'}</li>
                        <li>화이트보드: {roomPopupData.details.facilities.has_whiteboard ? '있음' : '없음'}</li>
                        <li>스피커: {roomPopupData.details.facilities.has_speakers ? '있음' : '없음'}</li>
                        <li>에어컨: {roomPopupData.details.facilities.has_airconditioner ? '있음' : '없음'}</li>
                        <li>와이파이: {roomPopupData.details.facilities.has_wifi ? '있음' : '없음'}</li>
                        {roomPopupData.details.facilities.has_special_equipment && (
                          <li>특수 장비: {roomPopupData.details.facilities.has_special_equipment}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 강의실 이미지 섹션 */}
{roomImages.length > 0 && (
  <div className="room-preview-images">
    {roomImages.map((image, idx) => {
      return (
        <div key={idx} className="room-preview-image-item">
          <h4>{image.type} 사진</h4>
          <img 
            src={image.path} 
            alt={`${roomPopupData.room} ${image.type}`} 
            onClick={() => {
              setSelectedImageIndex(idx);
              setShowRoomImageGallery(true);
            }}
            onError={(e) => {
              console.log(`이미지 로드 실패: ${image.path}`);
              e.target.onerror = null;
              e.target.src = '/build/default-room.png';
            }}
          />
        </div>
      );
    })}
  </div>
)}

              {/* 사진 갤러리 버튼 */}
              {roomImages.length > 0 && (
                <div className="view-photo-button">
                  <button className="view-photo-btn" onClick={() => setShowRoomImageGallery(true)}>
                    모든 강의실 사진 보기
                  </button>
                </div>
              )}

              {/* 사진 갤러리 표시 - 모달 */}
              {showRoomImageGallery && (
                <div className="room-image-gallery">
                  {roomImages.length > 0 ? (
                    <div className="image-container">
                      <h4>{roomPopupData.room} 강의실 사진</h4>
                      <div className="image-navigation">
                        <button onClick={() => navigateImage('prev')} disabled={roomImages.length <= 1}>
                          &lt; 이전
                        </button>
                        <span>{selectedImageIndex + 1} / {roomImages.length}</span>
                        <button onClick={() => navigateImage('next')} disabled={roomImages.length <= 1}>
                          다음 &gt;
                        </button>
                      </div>
                      
                      <div className="image-display">
                        <img
                          src={roomImages[selectedImageIndex]?.path}
                          alt={`${roomPopupData.room} ${roomImages[selectedImageIndex]?.type}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/build/default-room.png';
                          }}
                        />
                        <p className="image-description">
                          {roomPopupData.room} 강의실 {roomImages[selectedImageIndex]?.type}
                          {roomImages[selectedImageIndex]?.description && (
                            <span> - {roomImages[selectedImageIndex].description}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="image-thumbnails">
                        {roomImages.map((image, idx) => (
                          <div 
                            key={idx} 
                            className={`thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                            onClick={() => setSelectedImageIndex(idx)}
                          >
                            <img 
                              src={image.path} 
                              alt={image.type}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/build/default-room.png';
                              }}
                            />
                            <span>{image.type}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="close-gallery" onClick={() => setShowRoomImageGallery(false)}>
                        닫기
                      </button>
                    </div>
                  ) : (
                    <div className="no-images">
                      <p>이 강의실에 대한 사진이 없습니다.</p>
                      <button onClick={() => setShowRoomImageGallery(false)}>닫기</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 시간표는 있을 때만 표시 */}
            {!roomPopupData.imagesOnly && roomPopupData.schedule.length > 0 && (
              <>
                <p>강의실 시간표</p>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>교시</th>
                      <th>시간</th>
                      <th>월</th>
                      <th>화</th>
                      <th>수</th>
                      <th>목</th>
                      <th>금</th>
                      <th>토</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dedupedSchedule.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.period}</td>
                        <td>{entry.start_time} ~ {entry.end_time}</td>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => {
                          const subject = entry[day];
                          const bgColor = subject ? colorMap[subject] : 'transparent';  // 여기 수정됨
                          return (
                            <td
                              key={day}
                              style={{ backgroundColor: bgColor, transition: 'background-color 0.3s' }}
                            >
                              {subject || '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            
            {/* 시간표가 없을 때 메시지 */}
            {roomPopupData.imagesOnly && (
              <p className="no-schedule-message">이 강의실의 시간표 정보가 없습니다.</p>
            )}
          </div>
        </>
      )}

      {lecturePopupData && (
        <div
          className="build-popup"
          style={{
            top: lecturePopupData.position?.y || 0,
            left: lecturePopupData.position?.x || 0,
            position: 'absolute',
          }}
        >
          <button className="close-btn" onClick={() => setLecturePopupData(null)}>X</button>
          <h3>{lecturePopupData.name}</h3>
          {lecturePopupData.image ? (
            <img 
              src={lecturePopupData.image} 
              alt={lecturePopupData.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/build/default-room.png';
              }}
            />
          ) : (
            <p>사진 정보가 없습니다.</p>
          )}
          <div>
            <h4>건물 상세 정보</h4>
            <p><strong>라운지:</strong> {buildingInfo[lecturePopupData.name]?.lounge || '정보 없음'}</p>
            <p><strong>학과 사무실:</strong> {
              Array.isArray(buildingInfo[lecturePopupData.name]?.offices) && buildingInfo[lecturePopupData.name].offices.length > 0
              ? buildingInfo[lecturePopupData.name].offices.join(', ')
              : '정보 없음'
            }</p>

            <h4>층 정보</h4>
            {lecturePopupData.floors && Object.keys(lecturePopupData.floors).length > 0 ? (
              <ul className="floor-rooms-list">
                {Object.entries(lecturePopupData.floors).map(([floor, rooms]) => (
                  <li key={floor}>
                    {floor}층:{' '}
                    {rooms.map((room) => (
                      <span
                        key={room}
                        className="room-item"
                        onClick={() => handleFloorRoomClick(room)}
                        style={{ 
                          cursor: 'pointer',
                          marginRight: '5px', 
                          padding: '3px 6px',
                          color: '#0056b3',
                          backgroundColor: '#e6f2ff',
                          borderRadius: '3px',
                          display: 'inline-block',
                          margin: '2px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#cce5ff';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6f2ff';
                        }}
                      >
                        {room}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <p>층 정보가 없습니다.</p>
            )}
          </div>
        </div>
      )}
      
      {/* 추가 CSS 스타일 */}
      <style jsx>{`
        .room-image-gallery {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .image-container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 80%;
          max-height: 80%;
          overflow: auto;
          display: flex;
          flex-direction: column;
        }
        
        .image-container h4 {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .image-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .image-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .image-display img {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }
        
        .image-description {
          margin-top: 10px;
          font-weight: bold;
        }
        
        .image-thumbnails {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .thumbnail {
          width: 80px;
          text-align: center;
          cursor: pointer;
          padding: 5px;
          border: 2px solid transparent;
        }
        
        .thumbnail.active {
          border-color: #3498db;
          background-color: #f0f8ff;
        }
        
        .thumbnail img {
          width: 100%;
          height: 60px;
          object-fit: cover;
        }
        
        .thumbnail span {
          display: block;
          font-size: 12px;
          margin-top: 3px;
        }
        
        .close-gallery {
          margin: 0 auto;
          padding: 8px 16px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .no-images {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .no-schedule-message {
          margin: 20px 0;
          text-align: center;
          color: #777;
          font-style: italic;
        }

        .room-preview-images {
          display: flex;
          gap: 20px;
          margin: 15px 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .room-preview-image-item {
          width: 45%;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .room-preview-image-item h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #333;
        }
        
        .room-preview-image-item img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 5px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .room-preview-image-item img:hover {
          transform: scale(1.03);
        }
        
        .view-photo-btn {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          margin: 10px 0;
          transition: background-color 0.3s;
        }
        
        .view-photo-btn:hover {
          background-color: #3a7bc8;
        }
      `}</style>
    </>
  );
};

export default App;
