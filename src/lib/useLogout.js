import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Optional: Notify backend
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Backend logout failed:", error);
        }
      }

      // Clear all localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");

      // Redirect
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
  };

  return { logout };
}