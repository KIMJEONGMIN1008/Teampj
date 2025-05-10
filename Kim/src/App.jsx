import React, { useState } from 'react';
import Map from './components/map';
import './App.css';

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // 알림 팝업 열림 상태
  const [notifications, setNotifications] = useState([]); // 알림 상태 (알림이 없으면 빈 배열)

  // 알림 팝업을 토글하는 함수
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen); // 팝업 열고 닫기
  };

  // 새로운 알림을 추가하는 함수
  const addNotification = () => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      '새로운 알림이 도착했습니다!'
    ]);
  };

  return (
    <>
      <header className="app-header">
        <div className="logo">Campus<br />Guide</div>

        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="mic-button">
            <img src="png/mic.png" alt="Mic" />
          </button>
        </div>

        <div className="icons">
          <img
            src="png/bell.png"
            alt="Notification"
            className="icon-img"
            onClick={() => {
              toggleNotification();
              addNotification(); // 알림 추가
            }} // 알림을 추가하는 함수 호출
          />

          {isNotificationOpen && (
            <div id="notification-popup" className="notification-popup">
              <p id="notification-message">
                {notifications.length === 0 ? '새 알림이 없습니다' : notifications.join('\n')}
              </p>
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

      <Map />

      {/* 슬라이딩 사이드바 */}
      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>×</button>
        <h2>메뉴</h2>
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      {/* 배경 어두움 */}
      {showSidebar && <div className="backdrop" onClick={() => setShowSidebar(false)} />}
    </>
  );
};

export default App;
