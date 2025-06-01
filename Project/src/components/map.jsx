import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import { addOutlineLayer, addMarkerAndHighlight } from './maputil';
import { buildingInfo } from './building_data';

mapboxgl.accessToken = 'pk.eyJ1IjoidHJvbGx0cmFwZXIiLCJhIjoiY205OWFjeG03MGMwbzJscTdyY3Y5YW4yNCJ9.PlNQadNvH8kstlRJqs8Jfg';

const Map = ({ setRoomPopupData, setLecturePopupData, mapRef }) => {
  const mapContainer = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);   // map 객체 저장
  const [selectedBuilding, setSelectedBuilding] = useState(null); // 팝업에 띄울 건물 정보
  const [popup, setPopup] = useState(null); // mapbox Popup 객체 저장

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [128.8498090452777, 35.90041253141588],
      zoom: 17,
      attributionControl: false,
      doubleClickZoom: false,
    });

    setMapInstance(map);

    const buildingFiles = [
      '/data/building(engineering).json',
      '/data/building(convenience).json',
      '/data/building(life-sciences).json',
      '/data/building(rehabilitation).json',
      '/data/building(management).json',
      '/data/building(cooperation).json',
      '/data/building(humanities).json',
    ];

    const customControl = document.createElement('div');
        customControl.className = 'custom-zoom-controls';
        customControl.innerHTML = `
          <button class="custom-zoom-in">+</button>
          <button class="custom-zoom-out">-</button>
        `;

    Promise.all(buildingFiles.map(url => fetch(url).then(res => res.json())))
      .then(geojsonList => {
        const combinedGeojson = {
          type: 'FeatureCollection',
          features: [],
        };

        geojsonList.forEach(item => {
          if (item.type === 'FeatureCollection') {
            combinedGeojson.features.push(...item.features);
          } else if (item.type === 'Feature') {
            combinedGeojson.features.push(item);
          }
        });

        map.on('load', () => {
          addOutlineLayer(map, combinedGeojson);

          const ZoomControl = {
            onAdd: function (map) {
              const container = document.createElement('div');
              container.className = 'custom-zoom-controls';

              const zoomIn = document.createElement('button');
              zoomIn.textContent = '+';
              zoomIn.className = 'custom-zoom-in';
              zoomIn.onclick = () => map.zoomIn();

              const zoomOut = document.createElement('button');
              zoomOut.textContent = '−';
              zoomOut.className = 'custom-zoom-out';
              zoomOut.onclick = () => map.zoomOut();

              container.appendChild(zoomIn);
              container.appendChild(zoomOut);

              this._container = container;
              return container;
            },
            onRemove: function () {
              if (this._container?.parentNode) {
                this._container.parentNode.removeChild(this._container);
              }
            }
          };

          map.addControl(ZoomControl, 'bottom-right');

          map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['buildings-outline'],
            });

            if (features.length > 0) {
              const clickedFeature = features[0];
              addMarkerAndHighlight(map, clickedFeature);

              // 기존 팝업 있으면 제거
              if (popup) {
                popup.remove();
                setPopup(null);
              }
            } 
            
            else {  // 건물 외 영역 클릭 시 외곽선 제거
              if (map.getSource('selected-outline')) {
                map.getSource('selected-outline').setData({
                  type: 'FeatureCollection',
                  features: [],
                });
              }

              if (window.currentMarker) {
                window.currentMarker.remove();
                window.currentMarker = null;
              }
            }
          });

          // 더블 클릭 이벤트 추가
          map.on('dblclick', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['buildings-outline'],
            });

            if (features.length > 0) {
              const clickedFeature = features[0];
              const buildingName = clickedFeature.properties.name;
              const buildingData = buildingInfo[buildingName];

              // 화면 상에서 클릭한 좌표 기준으로 오른쪽 위치에 나타나도록
              const clickX = e.originalEvent.clientX + 200; // 오른쪽으로 20px 이동
              const clickY = e.originalEvent.clientY - 350; // 살짝 위로 조정
              
              setLecturePopupData({
                type: 'building',
                name: buildingName,
                image: buildingData?.image || null,
                floors: buildingData?.floors || {},
                position: {
                  x: clickX,
                  y: clickY,
                },
              });

              setRoomPopupData(null);

              // 기존 HTML 팝업 있으면 제거 (React 팝업 사용 시)
              if (popup) popup.remove();
            } else {
              // 건물이 아닌 곳 더블클릭 시 팝업 닫기 (선택사항)
              setLecturePopupData(null);
              setRoomPopupData(null);
            }
          });

        });
      });

    return () => {
      if (popup) popup.remove();
      map.remove();
    };

    mapRef.current = map;
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
