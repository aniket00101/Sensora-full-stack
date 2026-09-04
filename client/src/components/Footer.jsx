import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="container-x py-12 grid md:grid-cols-4 gap-8 text-sm text-white/60">
        <div>
          <div className="font-display font-bold text-white text-lg mb-2">SENSORA<span className="text-accent">.</span></div>
          <p>Sensing Intelligence. Engineering Autonomy.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Technologies</div>
          <ul className="space-y-2">
            <li><Link to="/technologies" className="hover:text-accent">Sensors</Link></li>
            <li><Link to="/technologies" className="hover:text-accent">Robotics</Link></li>
            <li><Link to="/technologies" className="hover:text-accent">Drones & VTOL</Link></li>
            <li><Link to="/technologies" className="hover:text-accent">AI & Autonomous Systems</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Company</div>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/careers" className="hover:text-accent">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-accent">Admin</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Start a Project</div>
          <p className="mb-3">Have a problem that needs sensing, intelligence or autonomy?</p>
          <Link to="/contact" className="btn-ghost !py-2 !px-4 text-xs">Build With Sensora</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Sensora Technology Private Limited. All rights reserved.
      </div>
    </footer>
  );
}
