import mapboxgl from 'mapbox-gl';

export const addOutlineLayer = (map, geojsonData) => {
  map.addSource('campus-buildings', {
    type: 'geojson',
    data: geojsonData,
  });

  map.addLayer({
    id: 'buildings-outline',
    type: 'fill',
    source: 'campus-buildings',
    paint: {
      'fill-color': '#0074D9',
      'fill-opacity': 0,
    },
  });
};

export const addMarkerAndHighlight = (map, feature) => {
  const markerCoordinates = feature.properties.marker;
  const coords = feature.geometry.coordinates[0];
  const center = coords[Math.floor(coords.length / 2)];

  // 마커 제거
  if (window.currentMarker) {
    window.currentMarker.remove();
  }

  // 마커 이미지 요소 생성
  const markerElement = document.createElement('img');
  markerElement.src = '/png/marker.png';
  markerElement.style.width = '100px';
  markerElement.style.height = '100px';
  markerElement.style.cursor = 'pointer';
  markerElement.style.position = 'absolute'; 
  markerElement.style.zIndex = '9999';   

  markerElement.onload = () => {
    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat(markerCoordinates && Array.isArray(markerCoordinates) ? markerCoordinates : center)
      .addTo(map);

    window.currentMarker = marker;
    console.log("✅ Marker added at:", marker.getLngLat());
  };

  markerElement.onerror = (err) => {
    console.error("❌ Marker image failed to load:", err);
  };

  // 기존 하이라이트 제거
  if (map.getLayer('highlight')) {
    map.removeLayer('highlight');
    map.removeSource('highlight');
  }

  // 하이라이트 새로 추가
  map.addSource('highlight', {
    type: 'geojson',
    data: feature,
  });

  map.addLayer({
    id: 'highlight',
    type: 'line',
    source: 'highlight',
    paint: {
      'line-color': '#FF0000',
      'line-width': 4,
    },
  });
};