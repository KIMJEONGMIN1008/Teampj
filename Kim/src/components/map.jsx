import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import { addOutlineLayer, addMarkerAndHighlight } from './maputil';

mapboxgl.accessToken = 'pk.eyJ1IjoidHJvbGx0cmFwZXIiLCJhIjoiY205OWFjeG03MGMwbzJscTdyY3Y5YW4yNCJ9.PlNQadNvH8kstlRJqs8Jfg';

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    // Mapbox 지도 초기화
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [128.849795, 35.902195],
      zoom: 16,
      attributionControl: false,
    });
    


    // 확대, 축소 버튼
    const customControl = document.createElement('div');
    customControl.className = 'custom-zoom-controls';
    customControl.innerHTML = `
      <button class="custom-zoom-in">+</button>
      <button class="custom-zoom-out">-</button>
    `;
    
    map.getContainer().appendChild(customControl);

    customControl.querySelector('.custom-zoom-in').onclick = () => map.zoomIn();
    customControl.querySelector('.custom-zoom-out').onclick = () => map.zoomOut();

    // 저작권 표시
    const attribution = document.createElement('div');
    attribution.className = 'custom-attribution';
    attribution.innerHTML = '© Mapbox | © OpenStreetMap contributors';
    map.getContainer().appendChild(attribution);

    // GeoJSON 데이터 불러오기
    fetch('/data/building.json')
      .then((res) => res.json())
      .then((geojson) => {
        // 외곽선 표시
        addOutlineLayer(map, geojson);

        // 클릭 이벤트 처리
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['buildings-outline'],
            });
            
            console.log('Clicked features:', features);

            if (features.length > 0) {
              const clickedFeature = features[0];
              addMarkerAndHighlight(map, clickedFeature);
            }
          });
        });

    return () => {
      map.remove(); // cleanup
    };
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
