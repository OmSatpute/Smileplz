import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import EventLanding from "@/pages/EventLanding";
import CameraCapture from "@/pages/CameraCapture";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventLanding />} />
          <Route path="/event/:eventId" element={<EventLanding />} />
          <Route path="/event/:eventId/capture" element={<CameraCapture />} />
          <Route path="/event/:eventId/gallery" element={<Gallery />} />
          <Route path="/capture" element={<CameraCapture />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-ui",
          style: {
            background: "#121212",
            color: "#F9F9F8",
            border: "1px solid #2a2a2a",
            borderRadius: "2px",
            fontSize: "13px",
            letterSpacing: "0.04em",
          },
        }}
      />
    </div>
  );
}

export default App;
