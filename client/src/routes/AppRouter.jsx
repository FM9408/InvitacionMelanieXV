import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRute';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFound from '../pages/404';
import { InvitacionNarrativa } from '../components/invitation/narrativeComponent';
import Homepage from '../pages/Homepage';
import AsignaciondeMesas from '../pages/AsignaciónDeMesa';
import GuestDashboard from '../pages/UserDashBoards';
import InMemoriam from '../pages/inMemoriam';
import { Paper, Typography } from '@mui/material';

const AppRouter = () => {
    return (
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
            <Route path='/inMemoriam' element={<InMemoriam />} />
            <Route path='/admin' element={<ProtectedRoute />}>
                <Route path='' element={<Navigate to='dashboard' />} />
                <Route path='' element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
                    <Route path='mesas' element={<AsignaciondeMesas />} />
                    <Route path='inMemoriam' element={<InMemoriam />} />
                </Route>
            </Route>

            <Route path='*' element={<Navigate to='/404' replace={false} />} />
            <Route path='/404' element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
