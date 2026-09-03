import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import GeneratePage from './pages/GeneratePage';
import DocumentsPage from './pages/DocumentsPage';
import UploadPage from './pages/UploadPage';
import DocumentWorkspacePage from './pages/DocumentWorkspacePage';
import LegalChatPage from './pages/LegalChatPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import SharedDocumentPage from './pages/SharedDocumentPage';
import NotFoundPage from './pages/NotFoundPage';

function Shell({children, roles}) {
  return (
    <ProtectedRoute roles={roles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
      <Route path="/reset-password" element={<ResetPasswordPage/>}/>
      <Route path="/verify-email" element={<VerifyEmailPage/>}/>
      <Route path="/share/:token" element={<SharedDocumentPage/>}/>

      <Route path="/app" element={<Navigate to="/app/dashboard" replace/>}/>
      <Route path="/app/dashboard" element={<Shell><DashboardPage/></Shell>}/>
      <Route path="/app/templates" element={<Shell><TemplatesPage/></Shell>}/>
      <Route path="/app/generate/:templateId?" element={<Shell><GeneratePage/></Shell>}/>
      <Route path="/app/documents" element={<Shell><DocumentsPage/></Shell>}/>
      <Route path="/app/documents/:id" element={<Shell><DocumentWorkspacePage/></Shell>}/>
      <Route path="/app/upload" element={<Shell><UploadPage/></Shell>}/>
      <Route path="/app/chat" element={<Shell><LegalChatPage/></Shell>}/>
      <Route path="/app/settings" element={<Shell><SettingsPage/></Shell>}/>
      <Route path="/app/admin" element={<Shell roles={['admin']}><AdminPage/></Shell>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}
