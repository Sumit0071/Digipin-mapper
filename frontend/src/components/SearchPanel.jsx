import { useState, useEffect } from 'react';

const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const SearchPanel = ( {
    latitude,
    longitude,
    digipin,
    setLatitude,
    setLongitude,
    setDigipin,
    mode,
    setMode,
    handleSearchError,
    mapInstance,
    markerRef,
} ) => {
    const [placeQuery, setPlaceQuery] = useState( '' );

    const loadMapplsScripts = () => {
        return new Promise( ( resolve, reject ) => {
            if ( window.mappls?.search ) return resolve();

            const sdkScript = document.createElement( 'script' );
            sdkScript.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
            sdkScript.async = true;
            sdkScript.onload = () => {
                const pluginScript = document.createElement( 'script' );
                pluginScript.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0`;
                pluginScript.async = true;
                pluginScript.onload = resolve;
                pluginScript.onerror = reject;
                document.body.appendChild( pluginScript );
            };
            sdkScript.onerror = reject;
            document.body.appendChild( sdkScript );
        } );
    };

    const placeMarker = ( lat, lng, popupText ) => {
        if ( !mapInstance || isNaN( lat ) || isNaN( lng ) ) return;

        if ( markerRef.current ) markerRef.current.remove();

        const marker = new window.mappls.Marker( {
            map: mapInstance,
            position: { lat, lng },
            popupHtml: `<b>${popupText ? 'Place:' : 'Coordinates:'}</b> ${popupText || `${lat}, ${lng}`}`,
            popupOptions: { open: true },
        } );

        markerRef.current = marker;
        mapInstance.setCenter( { lat, lng } );
    };

    const handleSearch = async () => {
        if ( mode === 'coordinates' ) {
            const lat = parseFloat( latitude );
            const lng = parseFloat( longitude );
            if ( isNaN( lat ) || isNaN( lng ) ) {
                handleSearchError( 'Please enter valid coordinates' );
                return;
            }
            encodeAndShow( lat, lng );
        } else if ( mode === 'digipin' ) {
            if ( !digipin.trim() ) {
                handleSearchError( 'Please enter a Digipin' );
                return;
            }
            decodeAndShow( digipin.trim() );
        }
    };

    const encodeAndShow = async ( lat, lng ) => {
        try {
            const res = await fetch( `${BACKEND_URL}/api/digipin/encode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { latitude: lat, longitude: lng } ),
            } );
            const data = await res.json();
            setDigipin( data.digipin );
            placeMarker( lat, lng, data.digipin );
        } catch ( err ) {
            console.error( err );
            handleSearchError( 'Encoding failed' );
        }
    };

    const decodeAndShow = async ( code ) => {
        try {
            const res = await fetch( `${BACKEND_URL}/api/digipin/decode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { digipin: code } ),
            } );
            const data = await res.json();
            setLatitude( data.latitude );
            setLongitude( data.longitude );
            placeMarker( data.latitude, data.longitude, code );
        } catch ( err ) {
            console.error( err );
            handleSearchError( 'Decoding failed' );
        }
    };

    // Load and bind place autocomplete
    useEffect( () => {
        if ( mode !== 'placename' ) return;

        ( async () => {
            try {
                await loadMapplsScripts();

                const input = document.getElementById( 'mappls-autocomplete' );
                if ( !input || input.dataset.bound ) return;
                input.dataset.bound = 'true';

                const config = { region: 'IND', height: 300 };

                new window.mappls.search( input, config, ( data ) => {
                    if ( data && data.length > 0 ) {
                        const dt = data[0];
                        if ( !dt || !dt.latitude || !dt.longitude ) return;

                        const lat = parseFloat( dt.latitude );
                        const lng = parseFloat( dt.longitude );
                        const place = dt.placeName + ', ' + dt.placeAddress;

                        setLatitude( lat );
                        setLongitude( lng );
                        setPlaceQuery( dt.placeName );
                        placeMarker( lat, lng, place );
                    }
                } );
            } catch ( err ) {
                console.error( 'Mappls SDK load failed', err );
                handleSearchError( 'Place search failed to load.' );
            }
        } )();
    }, [mode] );

    return (
        <div className="absolute top-6 left-6 z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-6 w-[350px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Location</h2>
            <div className="flex mb-4 space-x-2">
                {['coordinates', 'digipin', 'placename'].map( ( m ) => (
                    <button
                        key={m}
                        className={`flex-1 py-2 rounded ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200'} cursor-pointer text-sm`}
                        onClick={() => setMode( m )}
                    >
                        By {m.charAt( 0 ).toUpperCase() + m.slice( 1 )}
                    </button>
                ) )}
            </div>

            {mode === 'coordinates' && (
                <>
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={( e ) => setLatitude( e.target.value )}
                        className="border p-2 mb-2 w-full rounded"
                    />
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={( e ) => setLongitude( e.target.value )}
                        className="border p-2 mb-4 w-full rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                </>
            )}

            {mode === 'digipin' && (
                <>
                    <input
                        type="text"
                        placeholder="Enter Digipin"
                        value={digipin}
                        onChange={( e ) => setDigipin( e.target.value )}
                        className="border p-2 mb-4 w-full rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    >
                        Search
                    </button>
                </>
            )}

            {mode === 'placename' && (
                <input
                    type="text"
                    id="mappls-autocomplete"
                    placeholder="Search places or eLocs..."
                    value={placeQuery}
                    onChange={( e ) => setPlaceQuery( e.target.value )}
                    className="border p-2 mb-2 w-full rounded"
                />
            )}
        </div>
    );
};

export default SearchPanel;
