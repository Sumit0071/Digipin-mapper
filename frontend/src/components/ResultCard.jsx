const ResultCard = ({ digipin, latitude, longitude }) => {
  const copyToClipboard = () => {
    const text = `Digipin: ${digipin}\nLatitude: ${latitude}\nLongitude: ${longitude}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="absolute bottom-6 right-6 z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-6 w-[350px]">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Result</h3>
      <p className="text-sm text-gray-700">Digipin: <span className="font-medium">{digipin}</span></p>
      <p className="text-sm text-gray-700">Latitude: <span className="font-medium">{latitude}</span></p>
      <p className="text-sm text-gray-700 mb-4">Longitude: <span className="font-medium">{longitude}</span></p>
      <button
        onClick={copyToClipboard}
        className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
      >
        Copy to Clipboard
      </button>
    </div>
  );
};

export default ResultCard;
