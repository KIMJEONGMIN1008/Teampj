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
      setPopupData(null);
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
  
  // 강의실 클릭
  const handleRoomClick = (roomName, buildingName = '', position = null) => {

    const resolvedBuildingName = buildingName || findBuildingByRoom(roomName) || roomPopupData?.name || '';
    
    console.log('resolvedBuildingName:', resolvedBuildingName);

    const roomCourses = courses.filter(course => course.room === roomName);
    if (roomCourses.length === 0) {
      alert(`"${roomName}" 강의실 정보를 찾을 수 없습니다.`);
      return;
    }

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
      position: position || { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    });

    setLecturePopupData(null);
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
            setSearchTerm={(term) => {
              setSearchTerm(term);
              if (term && term.trim() !== '') {
                showPopupForTerm(term);
              } else {
                // 빈 문자열일 경우 팝업 닫기
                setPopupData(null);
              }
            }}
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

            <div className="room-info">
              <div className="title">강의실 정보</div>
              <div className="room-types"> 강의실 종류: {
                  roomPopupData.building && roomPopupData.room && buildingInfo[roomPopupData.building]?.roomDetails?.[roomPopupData.room]?.type
                    ? buildingInfo[roomPopupData.building].roomDetails[roomPopupData.room].type
                    : '정보 없음' }
              </div>

              <div className="view-photo-button">
                <button className="view-photo-btn" onClick={() => setShowRoomImage(true)}>
                  강의실 내부 보기
                </button>
              </div>

              {showRoomImage && (
                <div className="room-image-wrapper">
                  <img
                    src={buildingInfo[roomPopupData.building]?.roomDetails?.[roomPopupData.room]?.image}
                    alt={`${roomPopupData.room} 내부`}
                    style={{ maxWidth: '100%', marginTop: '10px' }}
                  />
                  <button onClick={() => setShowRoomImage(false)}>닫기</button>
                </div>
              )}
            </div>

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
            <img src={lecturePopupData.image} alt={lecturePopupData.name} />
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
              <ul>
                {Object.entries(lecturePopupData.floors).map(([floor, rooms]) => (
                  <li key={floor}>
                    {floor}층:{' '}
                    {rooms.map((room) => (
                      <span
                        key={room}
                        onClick={() => handleRoomClick(room)}
                        style={{ cursor: 'pointer', marginRight: '5px', color: 'black' }}
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
    </>
  );
};

export default App;
