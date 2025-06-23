import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/mapPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App;
