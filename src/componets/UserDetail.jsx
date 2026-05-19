import { Navigation } from "lucide-react";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef, useContext } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import BookingPendingOverlay from "../BookingComponent/BookingPending";
import ProviderList from "../BookingComponent/ProviderList";
import AssignedWorkerPanel from "../BookingComponent/AssignedWorkerPanel";
import FeedbackPanel from "../TrackingSystem/FeedBackPanel";
import { AuthContext } from "../config/AuthContext";

const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;

/* ================= ICONS ================= */

const customerIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
});

const workerIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
});

const selectedWorkerIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [48, 48],
});

/* ================= MAP HELPER ================= */

function FlyToSelected({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 0.5 });
    }
  }, [position]);

  return null;
}

/* ================= COMPONENT ================= */

export default function LocationSearchUI() {
  const { folkEmail, setBookingId, bookingId, service } =
    useContext(AuthContext);

  const location = useLocation();

  const [customerLocation, setCustomerLocation] = useState(
    location.state?.lat && location.state?.lng
      ? { lat: location.state.lat, lng: location.state.lng }
      : null
  );

  const customer = customerLocation
    ? [customerLocation.lat, customerLocation.lng]
    : [25.4432, 81.8479];

  const [providers, setProviders] = useState(location.state?.data || []);
  const [selectedId, setSelectedId] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [jobAccepted, setJobAccepted] = useState(false);

  const cardRefs = useRef({});

  /* ================= LOCATION ================= */

  useEffect(() => {
    if (!customerLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCustomerLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => console.warn("Location denied")
      );
    }
  }, []);

  /* ================= POLLING ================= */

  useEffect(() => {
    if (!customerLocation || !service) return;

    const fetchProviders = async () => {
      try {
        const res = await fetch(
          `${ApiZ}/api/auth/serviceData/getServiceData`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service,
              lat: customerLocation.lat,
              lng: customerLocation.lng,
            }),
          }
        );
        const data = await res.json();
        setProviders(data.data || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProviders();
    const id = setInterval(fetchProviders, 5000);
    return () => clearInterval(id);
  }, [customerLocation, service]);

  /* ================= BOOK ================= */

  const handleBookNow = async (email) => {
    setShowPending(true);
    const res = await fetch(`${ApiO}/api/booking/bookingReq/bookingReq`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        custmorEmail: folkEmail,
        workerEmail: email,
        service,
      }),
    });

    const data = await res.json();
    setBookingId(data.bookingId);
  };

  const selectedProvider = providers.find((p) => p._id === selectedId);

  const sortedProviders = [...providers].sort((a, b) => {
    if (a._id === selectedId) return -1;
    if (b._id === selectedId) return 1;
    return 0;
  });

  /* ================= RENDER ================= */

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-gray-50">

      {/* LEFT */}
      {!jobAccepted ? (
        <ProviderList
          sortedProviders={sortedProviders}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          cardRefs={cardRefs}
          setShowPending={setShowPending}
          handleBookNow={handleBookNow}
        />
      ) : (
        <AssignedWorkerPanel worker={selectedProvider} />
      )}

      {/* MAP */}
      <div className="flex-1 relative">
        <MapContainer center={customer} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          <Marker position={customer} icon={customerIcon}>
            <Popup>You</Popup>
          </Marker>

          {providers.map((p) => (
            <Marker
              key={p._id}
              position={[Number(p.lat), Number(p.lng)]}
              icon={p._id === selectedId ? selectedWorkerIcon : workerIcon}
              eventHandlers={{ click: () => setSelectedId(p._id) }}
            >
              <Popup>{p.name}</Popup>
            </Marker>
          ))}

          {selectedProvider && (
            <FlyToSelected
              position={[
                Number(selectedProvider.lat),
                Number(selectedProvider.lng),
              ]}
            />
          )}
        </MapContainer>

        <button className="absolute bottom-6 right-6 bg-white p-4 rounded-full shadow-xl">
          <Navigation className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* RIGHT FEEDBACK */}
    {/* RIGHT FEEDBACK PANEL */}
{selectedProvider && (
  <div className="w-full lg:w-[20%] h-[40vh] lg:h-full border-l bg-white overflow-y-auto">
    <FeedbackPanel selectedProvider={selectedProvider} />
  </div>
)}

      {/* OVERLAY */}
      {showPending && selectedProvider && (
        <BookingPendingOverlay
          provider={selectedProvider}
          bookingId={bookingId}
          onClose={() => setShowPending(false)}
          onAccept={() => setJobAccepted(true)}
        />
      )}
    </div>
  );
}
