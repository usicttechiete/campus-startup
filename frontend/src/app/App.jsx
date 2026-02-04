import { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import AIChatOverlay from '../components/AIChatOverlay/AIChatOverlay.jsx';

// Pages
import Login from '../pages/Login/Login.jsx';
import Home from '../pages/Home/Home.jsx';
import Events from '../pages/Events/Events.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import Internships from '../pages/Internships/Internships.jsx';
import Hire from '../pages/Hire/Hire.jsx';
import AdminStartupsDashboard from '../pages/AdminStartups/AdminStartupsDashboard.jsx';
import EventsList from '../pages/Events/EventsList.jsx';
import EventDetail from '../pages/Events/EventDetail.jsx';

// AI Chat Context
const AIChatContext = createContext();
export const useAIChat = () => useContext(AIChatContext);

// Sparkle AI Icon
const SparkleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// Global AI FAB Button with "AI" label
const AIFabButton = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`fixed bottom-24 z-40 flex h-12 items-center gap-1.5 px-4 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isOpen
      ? 'bg-gray-700 hover:bg-gray-800'
      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-xl'
      }`}
    style={{ right: 'max(16px, calc(50% - 240px + 16px))' }}
    aria-label="AI Assistant"
  >
    <SparkleIcon className="w-4 h-4" />
    <span className="text-sm font-semibold">AI</span>
  </button>
);

// App Layout with padding for content and navbar
const AppLayout = ({ children, showChat, setShowChat }) => (
  <div className="min-h-screen flex flex-col px-4 pb-20 pt-4">
    {children}
    <AIFabButton onClick={() => setShowChat(!showChat)} isOpen={showChat} />
    <AIChatOverlay isOpen={showChat} onClose={() => setShowChat(false)} />
    <Navbar />
  </div>
);

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <AIChatContext.Provider value={{ showChat, setShowChat }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout showChat={showChat} setShowChat={setShowChat}>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/list" element={<EventsList />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="internships" element={<Internships />} />
                  <Route path="hire" element={
                    <ProtectedRoute requiredRole="admin">
                      <Hire />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/startups" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminStartupsDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AIChatContext.Provider>
  );
};

export default App;
