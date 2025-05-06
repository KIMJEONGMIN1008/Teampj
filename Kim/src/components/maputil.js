import mapboxgl from 'mapbox-gl';
import centroid from '@turf/centroid';

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
    layout: {},
    interactive: true, 
  });
};

export const addMarkerAndHighlight = (map, feature) => {
  const markerCoords = feature.properties?.marker || null;
  let center;

  if (markerCoords && Array.isArray(markerCoords) && markerCoords.length === 2) {
    center = { lng: markerCoords[0], lat: markerCoords[1] };
  } else {
    const coords = feature.geometry.coordinates[0];
    center = coords.reduce(
      (acc, coord) => {
        acc.lng += coord[0];
        acc.lat += coord[1];
        return acc;
      },
      { lng: 0, lat: 0 }
    );
    center.lng /= coords.length;
    center.lat /= coords.length;
  }

  console.log('Calculated Center:', center);  // 디버깅용: 계산된 중심 좌표 확인

  // 기존 마커 제거
  if (window.currentMarker) window.currentMarker.remove();

  // 먼저 지도 이동
  map.flyTo({
    center: [center.lng, center.lat],
    zoom: 18,
    speed: 1.2,
    curve: 1,
    essential: true,
  });

  // flyTo가 끝난 후 마커 표시
  map.once('moveend', () => {
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([center.lng, center.lat])
      .addTo(map);
    window.currentMarker = marker;
    console.log("✅ Marker added at:", marker.getLngLat());
  });

  // 기존 하이라이트 제거
  if (map.getLayer('highlight')) {
    map.removeLayer('highlight');
  }
  if (map.getSource('highlight')) {
    map.removeSource('highlight');
  }

  // 하이라이트 추가
  map.addSource('highlight', {
    type: 'geojson',
    data: feature,
  });

  map.addLayer({
    id: 'highlight',
    type: 'line',
    source: 'highlight',
    paint: {
      'line-color': '#000000',
      'line-width': 3,
    },
  });
};
