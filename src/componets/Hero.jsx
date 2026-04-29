import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import States from "./States";
import SignupOverlay from "../AuthComponent/SignUpOverlay";
import { AuthContext } from "../config/AuthContext";

const serviceOptions = ["Plumber","Electrician","Mechanic","Barber","Carpenter","Painter","AC Technician", "TV Repair", "Welder","Cleaner","Gardener",
  "Pest Control",
  "Roofer",
  "Mason",
  "Driver",
];

const Api=import.meta.env.VITE_BACKEND_API;

const Hero = () => {

  const {signIn,signUp,setService}=useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [lat,setlat]=useState();
  const [lng,setlng]=useState();
  const [showSignIn,setShowSignIn]=useState(false);

 const navigate=useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      setlat(latitude);setlng(longitude);
      console.log(latitude,longitude)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const address = data.address.city || data.address.town || data.address.village || data.address.state;
      setLocation(address);
      setShowLocationOptions(false);
    },
    () => {
      alert("Unable to fetch your location. Please allow location access.");
    }
  );
};

const handleSearchButton=async()=>{
     if(!signIn){
       setShowSignIn(true);
       return;
     }
     const response=await fetch(`${Api}/api/auth/serviceData/getServiceData`,{
         method:'PUT',
         headers:{
           'Content-Type':'application/json'
         },
         body:JSON.stringify({"service":searchTerm,"lat":lat,"lng":lng})
     });
     const result=await response.json();
     const data=result.data;
     setService(searchTerm);
     console.log(data);
     navigate('/search',{state:{data,lat,lng}});
}

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-32 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Find Trusted Local
            <span className="text-blue-500"> Service Pros</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
          >
            Connect with verified professionals for all your home service needs
          </motion.p>

          {/* Search Form */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto border border-gray-100"
          >
            {/* Service Input */}
            <div className="relative flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search className="w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="What service do you need?"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowOptions(true);
                }}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
              />

              {showOptions && searchTerm && (
                <div
                  className="
                    absolute left-0 top-full mt-2 w-full 
                     bg-white border border-gray-200 rounded-xl shadow-lg
                         max-h-48 overflow-y-auto z-50"
                >
                  {serviceOptions
                    .filter((opt) =>
                      opt.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setSearchTerm(opt);
                          setShowOptions(false);
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  {serviceOptions.filter((opt) =>
                    opt.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-gray-400">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Input */}
           <div className="relative flex-1 flex items-center gap-3 px-4 py-2 bg-gray-50 
     rounded-xl border border-gray-200 focus-within:border-blue-500 
     focus-within:bg-white transition-all">

  <MapPin className="w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="Enter your location"
    value={location}
    onFocus={() => setShowLocationOptions(true)}
    onChange={(e) => {
      setLocation(e.target.value);
      setShowLocationOptions(true);
    }}
    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
  />

  {showLocationOptions && (
    <div className="absolute left-0 top-full mt-2 w-full bg-white border 
        border-gray-200 rounded-xl shadow-lg z-50">
      {/* Option 1: Use Current Location */}
      <div
        onClick={handleUseCurrentLocation}
        className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700 flex items-center gap-2"
      >
        <MapPin className="w-4 h-4 text-blue-500" />
        Use Current Location
      </div>
    </div>
  )}
</div>


            {/* Submit Button (Replaced) */}
  <button
    onClick={handleSearchButton}
    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
     >
              Search
            </button>
          </motion.form>
               {(showSignIn)&&
                <SignupOverlay
                    onClose={() => setShowSignIn(false)}
                    onSubmit={({ email, password }) => {
                     console.log(email, password);
                    setShowSignIn(false);
                  }}
                 />
                }

          {/* Stats */}
        <States/>
        
        </div>
      </div>
    </section>
  );
};

export default Hero;
