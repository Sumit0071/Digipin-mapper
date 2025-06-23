// components/MapContainer.jsx
import { useEffect } from 'react';
import axios from 'axios';

const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY;
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const MapContainer = ({
  mapInstance,
  setMapInstance,
  setLatitude,
  setLongitude,
  setDigipin,
  markerRef,
  setError,
}) => {
  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?v=3.0&layer=vector`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);

          const map = new window.mappls.Map('map', {
            center: [lat, lng],
            zoom: 14,
            clickableIcons: false,
          });

          map.addListener('click', async (event) => {
            const lat = event.lngLat.lat;
            const lng = event.lngLat.lng;
            setLatitude(lat);
            setLongitude(lng);
            await encodeAndShow(lat, lng, map);
          });

          setMapInstance(map);
        },
        () => {
          const map = new window.mappls.Map('map', {
            center: [28.6139, 77.209],
            zoom: 14,
          });
          setMapInstance(map);
        }
      );
    };

    loadMapScript();
  }, []);

  const encodeAndShow = async (lat, lng, map = mapInstance) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/digipin/encode`, {
        latitude: lat,
        longitude: lng,
      });
      const digi = response.data.digipin;
      setDigipin(digi);
      setLatitude(lat);
      setLongitude(lng);

      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      if (map) {
        map.setCenter({ lat, lng });
        const marker = new window.mappls.Marker({
          map,
          position: { lat, lng },
          popupHtml: `<b>Digipin:</b> ${digi}`,
          popupOptions: { open: true },
        });
        markerRef.current = marker;
      }
    } catch (err) {
      setError('Encoding failed');
      console.error(err);
    }
  };

  return <div id="map" className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default MapContainer;
