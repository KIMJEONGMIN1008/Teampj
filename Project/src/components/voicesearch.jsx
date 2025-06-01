import React, { useState, useEffect, useRef } from 'react';

const VoiceSearch = ({ searchTerm, setSearchTerm }) => {
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');  // 중간 인식 결과 저장
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ko-KR';
    recognition.interimResults = true;   // 중간 결과도 받기 위해 true
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setInterimTranscript('');  // 시작하면 초기화
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        const cleaned = final.trim();
        console.log("🎙 최종 음성 인식 결과:", cleaned);
        setInterimTranscript(cleaned);
        setSearchTerm(cleaned);  // ✅ 여기서 직접 전달
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onend = () => {
      setListening(false);
      console.log("음성 인식 결과(최종):", interimTranscript || searchTerm);

      const finalTerm = interimTranscript || searchTerm;

      // 빈 문자열이면 setSearchTerm 호출하지 않음
      if (finalTerm && finalTerm.trim() !== '') {
        setSearchTerm(finalTerm);
      }

      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
  }, [setSearchTerm, searchTerm, interimTranscript]);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <button
        onClick={toggleListening}
        className="mic-button"
        aria-label="search start/stop"
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
      >
        <img
          src="png/mic.png"
          alt={listening ? "recoding" : "mic"}
          style={{ width: '15px', height: '20px', filter: listening ? 'invert(33%) sepia(100%) saturate(635%) hue-rotate(174deg) brightness(98%) contrast(92%)' : 'none' }}
        />
      </button>

      {/* 음성 인식 중 팝업 창 */}
      {listening && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '20px 30px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          borderRadius: '10px',
          fontSize: '18px',
          zIndex: 9999,
          maxWidth: '80%',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}>
          <p>말하는 중...</p>
          <p style={{marginTop: '10px', fontWeight: 'bold'}}>
            {interimTranscript || '음성 인식 대기 중...'}
          </p>
          <small style={{opacity: 0.7}}>마이크 아이콘을 다시 눌러 음성 인식을 종료하세요.</small>
        </div>
      )}
    </>
  );
};

export default VoiceSearch;
