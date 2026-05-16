// client/src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const storedUser = globalThis.localStorage.getItem("user")
  const parsedUser = JSON.parse(storedUser)
  // Supongamos que tienes un slice de auth


  React.useEffect(() => {
    if (!isAdmin && globalThis.location.pathname.startsWith("/admin") ) {
    return <Navigate to="/" replace />;
  }
  if (parsedUser.id && globalThis.location.pathname.startsWith("/user")) {
    return <Navigate to={`/user/${parsedUser.id}/dashboard`} replace />;
  }
  }, [isAdmin, storedUser, parsedUser, globalThis.location.pathname])
  
  return <Outlet />; // Renderiza las rutas hijas
};

export default ProtectedRoute;