import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import ContentListPage from "./pages/ContentListPage";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ContentManager from "./admin/ContentManager";
import SectionsManager from "./admin/SectionsManager";
import ContactSubmissions from "./admin/ContactSubmissions";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/technologies"
          element={<ContentListPage type="technology" eyebrow="Technology Pillars" title="Advanced Sensor & Autonomous Technologies" description="Sensors • Robotics • Drones/UAV • VTOL • AI & Autonomous Systems" />}
        />
        <Route
          path="/solutions"
          element={<ContentListPage type="solution" eyebrow="Applications" title="Solutions Across Industries" description="Healthcare, defence, smart home, industry, environment and aerospace." />}
        />
        <Route
          path="/products"
          element={<ContentListPage type="product" eyebrow="Products" title="Products & Technology Platforms" description="As products become available, they're organized here by platform family." />}
        />
        <Route
          path="/rnd"
          element={<ContentListPage type="research" eyebrow="Research & Innovation" title="R&D, Prototypes & Publications" description="Current research, technology roadmap, patents/IP and collaborative research." />}
        />
        <Route
          path="/careers"
          element={<ContentListPage type="career" eyebrow="Careers" title="Build the Future With Sensora" description="Open roles for engineers and researchers across sensors, robotics, AI/ML and aerospace." />}
        />
        <Route path="/contact" element={<Contact />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="content/:type" element={<ContentManager />} />
          <Route path="sections" element={<SectionsManager />} />
          <Route path="submissions" element={<ContactSubmissions />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
