// utils/session.jsconst 

const setSession = () => {
  const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
  localStorage.setItem("session_expiry", expiryTime);
  console.log(expiryTime);
};
  
  export const isSessionValid = () => {
    const expiryTime = localStorage.getItem("session_expiry");
    return expiryTime && new Date().getTime() < parseInt(expiryTime);
  };
  
  export const clearSession = () => {
    localStorage.removeItem("session_expiry");
  };

  export default setSession;
  