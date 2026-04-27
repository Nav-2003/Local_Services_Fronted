const Api='http://localhost:3001';
const handleCancelButton = async ({ bookingId }) => {
      const response= await fetch(`${Api}/api/bokingCancelUser/cancelBooking`,{
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
