// components/MapContainer.jsx
import { useEffect } from 'react';
import axios from 'axios';

const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const MapContainer = ({
  mapInstance,
  setMapInstance,
  setLatitude,
  setLongitude,
  setDigipin,
  markerRef,
  currentLocationRef,
  setError,
}) => {
  useEffect(() => {
    let initialized = false;

    const loadMapScript = () => {
      if (window.mappls && window.mappls.Map) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (initialized) return;
      initialized = true;

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

          map.addListener('load', () => {
            const currentLocationMarker = new window.mappls.Marker({
              map,
              position: { lat, lng },
              title: 'Your Current Location',
              draggable: false,
              popupHtml: `<b>Your Current Location</b><br>Latitude: ${lat}<br>Longitude: ${lng}`,
              icon: 'https://img.icons8.com/?size=100&id=7880&format=png&color=FA5252',
            });

            currentLocationRef.current = currentLocationMarker;

            map.addListener('click', async (event) => {
              const { lat: clickLat, lng: clickLng } = event?.lngLat || {};
              if (!clickLat || !clickLng) return;

              setLatitude(clickLat);
              setLongitude(clickLng);
              await encodeAndShow(clickLat, clickLng, map);
            });

            setMapInstance(map);
          });
        },
        () => {
          const fallbackMap = new window.mappls.Map('map', {
            center: [28.6139, 77.209],
            zoom: 14,
          });

          fallbackMap.addListener('load', () => {
            setMapInstance(fallbackMap);
          });
        }
      );
    };

    loadMapScript();
  }, []);

  const encodeAndShow = async (lat, lng, map = mapInstance) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/digipin/encode`, {
        latitude: lat,
        longitude: lng,
      });

      const digi = res.data.digipin;
      setDigipin(digi);
      setLatitude(lat);
      setLongitude(lng);

      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      if (map && map.setCenter) {
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
