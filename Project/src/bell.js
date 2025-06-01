import React, { useState } from 'react';

function Notification() {
  const [notifications, setNotifications] = useState([]); // 알림 상태
  const [isOpen, setIsOpen] = useState(false); // 팝업 열림 상태

  // 알림 팝업을 열고 닫는 함수
  const toggleNotification = () => {
    setIsOpen(!isOpen); // 팝업 상태 토글
  };

  // 새로운 알림을 추가하는 함수
  const addNotification = () => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      '새로운 알림이 도착했습니다!' // 새로운 알림 메시지
    ]);
  };

  // 알림 아이콘 클릭 시 알림 추가 및 팝업 토글
  const handleIconClick = () => {
    addNotification(); // 알림 추가
    toggleNotification(); // 팝업 열기 또는 닫기
  };

  return (
    <div>
      <img 
        src="png/bell.png" 
        alt="Notification" 
        className="icon-img" 
        onClick={handleIconClick} // 아이콘 클릭 시 알림 추가 및 팝업 토글
      />
      
      {isOpen && (
        <div id="notification-popup" className="notification-popup">
          <p id="notification-message">
            {notifications.length === 0 ? '새 알림이 없습니다' : notifications.join('\n')}
          </p>
        </div>
      )}
    </div>
  );
}

export default Notification;
