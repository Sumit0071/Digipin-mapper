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
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const handleSearch = async () => {
        if ( mode === 'coordinates' ) {
            const lat = parseFloat( latitude );
            const lng = parseFloat( longitude );
            if ( !lat || !lng || isNaN( lat ) || isNaN( lng ) ) {
                handleSearchError( 'Please enter valid coordinates' );
                return;
            }
            encodeAndShow( lat, lng );
        } else {
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

    const placeMarker = ( lat, lng, digi ) => {
        if ( markerRef.current ) markerRef.current.remove();
        const marker = new window.mappls.Marker( {
            map: mapInstance,
            position: { lat, lng },
            popupHtml: `<b>Digipin:</b> ${digi}`,
            popupOptions: { open: true },
        } );
        markerRef.current = marker;
        mapInstance.setCenter( { lat, lng } );
    };

    return (
        <div className="absolute top-6 left-6 z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-6 w-[350px]">
            <img src="data:image/png;base64,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" alt="ultratech_logo" className="h-15 w-15" />
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Location</h2>
            <div className="flex mb-4 space-x-2">
                <button
                    className={`flex-1 py-2 rounded ${mode === 'coordinates' ? 'bg-blue-600 text-white' : 'bg-gray-200'} cursor-pointer`}
                    onClick={() => setMode( 'coordinates' )}
                >
                    By Coordinates
                </button>
                <button
                    className={`flex-1 py-2 rounded ${mode === 'digipin' ? 'bg-blue-600 text-white' : 'bg-gray-200'} cursor-pointer`}
                    onClick={() => setMode( 'digipin' )}
                >
                    By Digipin
                </button>
            </div>
            {mode === 'coordinates' ? (
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
                </>
            ) : (
                <input
                    type="text"
                    placeholder="Enter Digipin"
                    value={digipin}
                    onChange={( e ) => setDigipin( e.target.value )}
                    className="border p-2 mb-4 w-full rounded"
                />
            )}
            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
                Search
            </button>
        </div>
    );
};

export default SearchPanel;
