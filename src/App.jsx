import SearchResultPage from "./componets/SearchResultPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./Home";
import WorkerSignupForm from "./ServiceComponent/WorkerSignUpForm";
import WorkerWaitingForCustomer from "./ServiceComponent/WorkerWaitingForCustomer";
import LiveTrackingMap from "./TrackingSystem/Livetracking";
import Services from "./HeaderComponent/Services";
import HowItWorks from "./HeaderComponent/HowItWork";
import AboutUs from "./HeaderComponent/About";
import BookingFlow from "./HeaderComponent/BookingInform";
import BookingList from "./HeaderComponent/BookingList";
import SocketRegister from "./config/socketRegister";

function App() {
  return (
    <BrowserRouter>
    <SocketRegister/>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/howitwork" element={<HowItWorks />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/bookingsInform" element={<BookingFlow />} />
          <Route path="/service/workerDetail" element={<WorkerSignupForm />} />
          <Route
            path="/service/waitingRoom"
            element={<WorkerWaitingForCustomer />}
          />
          <Route path="/serivice/liveTracking" element={<LiveTrackingMap />} />
          <Route
            path="search/serivice/liveTracking"
            element={<LiveTrackingMap />}
          />
          <Route
            path="/bookingsInform/live"
            element={<BookingList status="accept" />}
          />
          <Route
            path="/bookingsInform/completed"
            element={<BookingList status="completed" />}
          />
          <Route
            path="/bookingsInform/cancelled"
            element={<BookingList status="cancel" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
