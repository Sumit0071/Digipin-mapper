import { useState, useRef } from 'react';
import SearchPanel from '../components/SearchPanel';
import ResultCard from '../components/ResultCard';
import MapContainer from '../components/MapContainer';
import { Routefind } from '../components/Routefind';
const MapPage = () => {
  const [latitude, setLatitude] = useState( '' );
  const [longitude, setLongitude] = useState( '' );
  const [digipin, setDigipin] = useState( '' );
  const [error, setError] = useState( '' );
  const [mode, setMode] = useState( 'coordinates' );
  const [mapInstance, setMapInstance] = useState( null );
  const markerRef = useRef( null );

  const handleSearchError = ( message ) => {
    setError( message );
    setTimeout( () => setError( '' ), 3000 );
  };

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        mapInstance={mapInstance}
        setMapInstance={setMapInstance}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        setDigipin={setDigipin}
        markerRef={markerRef}
        setError={handleSearchError}
      />
      <SearchPanel
        latitude={latitude}
        longitude={longitude}
        digipin={digipin}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        setDigipin={setDigipin}
        mode={mode}
        setMode={setMode}
        handleSearchError={handleSearchError}
        mapInstance={mapInstance}
        markerRef={markerRef}
      />
      <Routefind />
      {digipin && latitude && longitude && (
        <ResultCard
          digipin={digipin}
          latitude={latitude}
          longitude={longitude}
        />
      )}
      {error && (
        <p className="absolute bottom-2 left-6 text-red-600 bg-white px-4 py-2 rounded shadow">
          {error}
        </p>
      )}
    </div>
  );
}


export default MapPage