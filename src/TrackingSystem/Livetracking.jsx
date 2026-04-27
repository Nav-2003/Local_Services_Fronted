import { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import socket from "../config/socket";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AssignedWorkerPanel from "../BookingComponent/AssignedWorkerPanel";
import { AuthContext } from "../config/AuthContext";
import FloatingChat from "./FloatingChat";

/* ================= FIX LEAFLET ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LiveTrackingPage() {
  let { folkEmail,bookingId } = useContext(AuthContext);

  const [assignEmail, setAssignEmail] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [worker, setWorker] = useState(null);
  const [userDetail,setUserDetail]=useState();
  const Api=import.meta.env.VITE_BACKEND_API;

  /* ================= FETCH ASSIGNED EMAIL ================= */
  useEffect(() => {
    if (!folkEmail) return;

    const fetchAssigned = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/userData/getUserDetail`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: folkEmail,bookingId }),
        });
        const data = await res.json();
        setUserDetail({name:data.name,type:data.type,email:data.email,phone:data.phone,bookingId})
        setAssignEmail(data.email);
      } catch (err) {
        console.error("Assign email error:", err);
      }
    };

    fetchAssigned();
  }, [folkEmail]);

  /* ================= WORKER GPS (LIVE) ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setWorker({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ================= SOCKET POLLING ================= */
  useEffect(() => {
    if (!assignEmail || !worker) return;

    const interval = setInterval(() => {
      socket.emit("getLiveLocation", { email: assignEmail });

      socket.emit("putLiveLocation", {
        email: folkEmail,
        lat: worker.lat,
        lng: worker.lng,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [assignEmail, worker, folkEmail]);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    const handler = ({ lat, lng }) => {
    
      if (typeof lat === "number" && typeof lng === "number") {
        setCustomer({ lat, lng });
      }
    };

    socket.on("liveLocationResult", handler);
    return () => socket.off("liveLocationResult", handler);
  }, []);

  /* ================= SIMPLE UBER / RAPIDO ROUTE ================= */
  const liveRoute =
    worker && customer
      ? [
          [worker.lat, worker.lng],
          [customer.lat, customer.lng],
        ]
      : [];

  /* ================= UI ================= */
  
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        {/* ================= MAP ================= */}
        <main className="flex-1 p-3 lg:p-4">
          <div className="h-full rounded-2xl overflow-hidden border bg-white">
            {!customer || !worker ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading live tracking…
              </div>
            ) : (
              <MapContainer
                center={[customer.lat, customer.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                {/* CUSTOMER */}
                <Marker position={[customer.lat, customer.lng]} />

                {/* WORKER */}
                <Marker position={[worker.lat, worker.lng]} />

                {/* SIMPLE LIVE TRACK LINE (UBER STYLE) */}
                {liveRoute.length > 1 && (
                  <Polyline
                    positions={liveRoute}
                    pathOptions={{
                      color: "#2563eb",
                      weight: 6,
                      opacity: 0.85,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />
                )}
              </MapContainer>
            )}
          </div>
        </main>

        {/* ================= PROVIDER PANEL ================= */}
        <aside className="bg-white w-full lg:w-[360px] border-t lg:border-l overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b px-5 py-4">
            <h2 className="text-lg font-semibold">Your Provider</h2>
            <p className="text-sm text-gray-500">Live tracking & ETA</p>
          </div>

          <div className="p-5">
            {worker&&customer&&<AssignedWorkerPanel worker={userDetail}/>}
            {worker&&customer&&<FloatingChat data={userDetail}/>}
          </div>
{/* WORK COMPLETED BUTTON */}

        </aside>

      </div>
    </div>
  );
}
