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

  console.log('Calculated Center:', center);

  // 기존 마커 제거
  if (window.currentMarker) {
    window.currentMarker.remove();
    window.currentMarker = null;
  }

  // 지도 이동
  map.flyTo({
    center: [center.lng, center.lat],
    zoom: 18,
    speed: 1.2,
    curve: 1,
    essential: true,
  });

  // 마커 생성 (바로 추가)
  const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat([center.lng, center.lat])
    .addTo(map);
  window.currentMarker = marker;

  // selected-outline source 및 layer가 없는 경우 추가
  if (!map.getSource('selected-outline')) {
    map.addSource('selected-outline', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [feature],
      },
    });

  map.addLayer({
      id: 'selected-outline',
      type: 'line',
      source: 'selected-outline',
      paint: {
        'line-color': '#000000',
        'line-width': 3,
      },
    });
  } else {
    // 이미 존재하면 데이터만 갱신
    map.getSource('selected-outline').setData({
      type: 'FeatureCollection',
      features: [feature],
    });
  }
};
