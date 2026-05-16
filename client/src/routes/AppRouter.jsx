import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importaciones dinámicas (Lazy Loading)
const Dashboard = lazy(() => import('../pages/Dashboard'));
const InvitacionNarrativa = lazy(() => import('../components/invitation/narrativeComponent').then(module => ({ default: module.InvitacionNarrativa })));
const Homepage = lazy(() => import('../pages/Homepage'));
const SeatingChart = lazy(() => import('../pages/AsignaciónDeMesa').then(module => ({ default: module.SeatingChart })));
const InMemoriam = lazy(() => import('../pages/inMemoriam'));
const NotFound = lazy(() => import('../pages/404.jsx'));
const GuestDashboard = lazy(() => import('../pages/UserDashBoards.jsx'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const ProtectedRoute = lazy(() => import('../routes/ProtectedRute'));
const TableAssignment = lazy(() => import('../pages/AsignaciónDeMesa'));


const AppRouter = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
            {/* Ruta dinámica para el ID del invitado de PostgreSQL */}

            <Route path='/' element={<UserLayout />}>
                <Route path='' element={<Homepage />} />
                <Route
                    path='user/:familyID'
                    element={<InvitacionNarrativa />}
                />
                <Route
                    path='user/:familyID/dashboard'
                    element={<GuestDashboard />}
                />
            </Route>
            <Route path='/admin' element={<ProtectedRoute />}>
                <Route path='/admin' element={<Navigate to='dashboard' />} />
                <Route path='' element={<AdminLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='mesas' element={<SeatingChart />} />
                    <Route path='/admin/asignar-mesa/:id' element={<TableAssignment />} />
                </Route>
            </Route>

                    <Route path='/inMemoriam' element={<InMemoriam />} />
            <Route path='*' element={<Navigate to='/404' replace={false} />} />
            <Route path='/404' element={<NotFound />} />
        </Routes>
        </Suspense>
    );
};

export default AppRouter;
