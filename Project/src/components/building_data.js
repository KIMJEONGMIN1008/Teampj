export const buildingInfo = {
  '공학 7호관': {
    image: '/build/main/공학7호관.PNG',
    floors: {
      '7': ['7705A', '7705B', '7706', '7707', '7714'],
      '6': ['7605', '7606', '7607', '7615'],
      '5': ['7506', '7507A', '7507B', '7514'],
      '4': ['7405', '7406', '7409', '7418'],
      '3': ['7306', '7307'],
      '2': ['7205', '7206', '7207'],
      '1': ['7102A'],
    },

    lounge: '1층',
    offices: ['2층-IT 공과대학 행정실'],

    roomDetails: {
      '7102A': { 
        type: '강당', 
        useAPI: true
      },
      '7205': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7206': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7207': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7306': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7307': { 
        type: '컴퓨터 실습실', 
        useAPI: true
      },
      '7405': { 
        type: '일반 강의실',
        useAPI: true
      },
      '7406': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7409': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7418': { 
        type: '일반 강의실', 
        useAPI: true
      },
      '7506': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7507A': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7507B': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7514': { 
        type: '일반 강의실',
        useAPI: true
      },
      '7605': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7606': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7607': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7615': { 
        type: '일반 강의실',
        useAPI: true
      },
      '7705A': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7705B': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7706': { 
        type: '일반 강의실',
        useAPI: true
      },
      '7707': { 
        type: '컴퓨터 실습실',
        useAPI: true
      },
      '7714': { 
        type: '일반 강의실',
        useAPI: true
      },
    }
  },
  // 다른 건물들도 추가 가능
};

// 강의실 종류 정보 (SQL과 연동되지 않은 기본 정보)
export const roomTypeInfo = {
  '강당': '대규모 행사 및 특강을 위한 공간',
  '일반 강의실': '강의 진행을 위한 기본 교실',
  '컴퓨터 실습실': '컴퓨터를 활용한 실습 수업을 위한 공간',
  '실험실': '실험 및 연구를 위한 특수 공간'
};