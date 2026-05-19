const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;

const handleCancelButton = async ({ bookingId }) => {
      const response= await fetch(`${ApiO}/api/booking/bokingCancelUser/cancelBooking`,{
         method:"PUT",
         headers:{
           "Content-Type":"application/json"
         },
         body:JSON.stringify({bookingId})
      });
      const data=await response.json();
      console.log(data);
};

export default handleCancelButton;
