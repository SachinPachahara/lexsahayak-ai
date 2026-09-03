import { Navigate,useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({children,roles}){const {user,loading}=useAuth();const loc=useLocation();if(loading)return <div className="page-center"><div className="spinner"/><span>Restoring secure session…</span></div>;if(!user)return <Navigate to="/login" state={{from:loc}} replace/>;if(roles&&!roles.includes(user.role))return <Navigate to="/app" replace/>;return children;}
