// client/src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAdmin } = useSelector((state) => state.auth); // Supongamos que tienes un slice de auth

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renderiza las rutas hijas
};

export default ProtectedRoute;