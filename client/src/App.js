import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute'; // <-- Add this

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Settings/Profile';
import WorkoutForm from './pages/Workouts/WorkoutForm';
import EditWorkout from './pages/Workouts/EditWorkout';
import Nutrition from './pages/Nutrition';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Community from './pages/Community';
import Metrics from './pages/Metrics';
import BulkingCalculator from './pages/BulkingCalculator';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-darkBg">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Marketing Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected App Pages - Wrapped for Security */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/create-workout" element={<ProtectedRoute><WorkoutForm /></ProtectedRoute>} />
              <Route path="/edit-workout/:id" element={<ProtectedRoute><EditWorkout /></ProtectedRoute>} />
              <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
              <Route path="/library" element={<ExerciseLibrary />} />
              <Route path="/community" element={<Community />} />
              <Route path="/metrics" element={<ProtectedRoute><Metrics /></ProtectedRoute>} />
              <Route path="/bulking-calculator" element={<BulkingCalculator />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;