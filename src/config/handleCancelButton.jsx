const ip=import.meta.env.VITE_IP;

const handleCancelButton = async ({ bookingId }) => {
      const response= await fetch(`http://${ip}:3001/api/booking/bokingCancelUser/cancelBooking`,{
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
