import { useState, useRef, useEffect } from "react";

// Replace with your own OAuth2 access token from Mappls console
const MAPPLS_ACCESS_TOKEN = import.meta.env.VITE_MAPPLS_ACCESS_TOKEN;

export const Routefind = ({ mapInstance }) => {
    const [startLat, setStartLat] = useState("");
    const [startLng, setStartLng] = useState("");
    const [endLat, setEndLat] = useState("");
    const [endLng, setEndLng] = useState("");
    const [error, setError] = useState("");
    const [summary, setSummary] = useState(null);
    const polylineRef = useRef(null);
    const startMarkerRef = useRef(null);
    const endMarkerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_ACCESS_TOKEN}/map_sdk_plugins?v=3.0&libraries=direction`;
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleRouteFind = () => {
        if (!startLat || !startLng || !endLat || !endLng || !mapInstance) {
            setError("Enter valid coordinates for both start and end points");
            return;
        }

        setError("");
        if (polylineRef.current) polylineRef.current.remove();
        if (startMarkerRef.current) startMarkerRef.current.remove();
        if (endMarkerRef.current) endMarkerRef.current.remove();

        // Use the plugin once it's loaded
        const interval = setInterval(() => {
            if (window.mappls && window.mappls.direction) {
                clearInterval(interval);

                const directionObj = new window.mappls.direction({
                    map: mapInstance,
                    start: `${startLat},${startLng}`,
                    end: `${endLat},${endLng}`,
                    // You can customize these options further
                    alternatives: false,
                    steps: true,
                    geometries: "polyline",
                    overview: "simplified",
                    profile: "driving",
                });

                directionObj.on("load", (e) => {
                    // Handle summary
                    const route = e.routes[0];
                    if (!route) {
                        setError("No route found");
                        return;
                    }

                    setSummary({
                        distance: route.distance,
                        duration: route.duration,
                    });

                    // Draw polyline manually
                    const path = window.mappls.geometry.decode(route.geometry);
                    polylineRef.current = new window.mappls.Polyline({
                        map: mapInstance,
                        path,
                        strokeColor: "#FF5722",
                        strokeWeight: 5,
                        strokeOpacity: 0.9,
                    });

                    // Markers
                    startMarkerRef.current = new window.mappls.Marker({
                        map: mapInstance,
                        position: { lat: parseFloat(startLat), lng: parseFloat(startLng) },
                        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        title: "Start",
                    });

                    endMarkerRef.current = new window.mappls.Marker({
                        map: mapInstance,
                        position: { lat: parseFloat(endLat), lng: parseFloat(endLng) },
                        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        title: "End",
                    });

                    // Fit to bounds
                    const bounds = new window.mappls.LatLngBounds();
                    path.forEach((pt) => bounds.extend(pt));
                    mapInstance.fitBounds(bounds);
                });

                directionObj.on("error", (err) => {
                    console.error(err);
                    setError("Unable to fetch route using Directions plugin");
                });
            }
        }, 200);
    };

    return (
        <div className="absolute top-[26rem] left-6 z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-6 w-[350px]">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Find Route</h3>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Start Latitude"
                    value={startLat}
                    onChange={(e) => setStartLat(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="text"
                    placeholder="Start Longitude"
                    value={startLng}
                    onChange={(e) => setStartLng(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="text"
                    placeholder="End Latitude"
                    value={endLat}
                    onChange={(e) => setEndLat(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <input
                    type="text"
                    placeholder="End Longitude"
                    value={endLng}
                    onChange={(e) => setEndLng(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <button
                    onClick={handleRouteFind}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                    Plot Route
                </button>
                {summary && (
                    <div className="text-sm mt-2 text-gray-700">
                        <p><strong>Distance:</strong> {(summary.distance / 1000).toFixed(2)} km</p>
                        <p><strong>Duration:</strong> {(summary.duration / 60).toFixed(1)} min</p>
                    </div>
                )}
                {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
        </div>
    );
};
