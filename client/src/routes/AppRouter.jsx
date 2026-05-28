import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoadingPage from '../pages/loadingPage.jsx';

// Tus imports de promesas artificiales (los dejamos intactos como los tienes)
const Dashboard = React.lazy(() => import('../pages/Dashboard.jsx'));
const SeatingChart = React.lazy(() => import('../pages/AsignaciónDeMesa.jsx').then(m => ({ default: m.SeatingChart })));
const TableAssignment = React.lazy(() => import('../pages/AsignaciónDeMesa.jsx').then(m => ({ default: m.TableAssignment })));
const Homepage = lazy(() => 
    Promise.all([
        import('../pages/Homepage'),
        new Promise((resolve) => setTimeout(resolve, 5000)), // 5 segundos controlados e inmunes al Admin
    ]).then(([moduleExports]) => moduleExports)
);
const InvitacionNarrativa = lazy(() => import('../components/invitation/narrativeComponent').then(m => ({ default: m.InvitacionNarrativa })));
const NotFound = lazy(() => import('../pages/404.jsx'));
const GuestDashboard = lazy(() => import('../pages/UserDashBoards.jsx'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));
const AdminLayout = React.lazy(() => import('../layouts/AdminLayout.jsx'));
const ProtectedRoute = React.lazy(() => import('../routes/ProtectedRute.jsx'));
const InMemoriam = lazy(() => import('../pages/inMemoriam'));

const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas de usuario con su propio Suspense aislado */}
            <Route path='/' element={
                <Suspense fallback={<LoadingPage />}><UserLayout /></Suspense>
            }>
                <Route path='' element={<Homepage />} />
                <Route path='user/:familyID' element={<InvitacionNarrativa />} />
                <Route path='user/:familyID/dashboard' element={<GuestDashboard />} />
            </Route>

            {/* Panel de administración protegido */}
            <Route path='/admin' element={<ProtectedRoute />}>
                {/* Envolvemos directamente las subrutas en un Suspense plano SIN KEY 
                    para que no destruya el layout de la AppBar al cambiar de pestaña */}
                <Route path='' element={
                    <Suspense fallback={<LoadingPage />}>
                        <AdminLayout  />
                    </Suspense>
                }>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='mesas' element={<SeatingChart />} />
                    <Route path='asignar-mesa/:id' element={<TableAssignment />} />
                </Route>
            </Route>

            <Route path='/inMemoriam' element={<Suspense fallback={<LoadingPage />}><InMemoriam /></Suspense>} />
            <Route path='*' element={<Navigate to='/404' replace={false} />} />
            <Route path='/404' element={<Suspense fallback={<LoadingPage />}><NotFound /></Suspense>} />
        </Routes>
    );
};

export default AppRouter;