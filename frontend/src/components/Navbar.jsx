import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

function Navbar() {
  return (
    <nav className="glass" style={{
      position:"fixed",
      top:0,
      width:"100%",
      zIndex:10
    }}>
      <div className="container" style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"18px 0"
      }}>
        
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <Activity size={24}/>
          <h2 className="gradient-text">MediRisk</h2>
        </div>

        <div style={{display:"flex",gap:"20px"}}>
          <Link to="/login">Sign In</Link>
          <Link to="/register">
            <button style={{
              background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
              border:"none",
              padding:"8px 16px",
              borderRadius:"8px",
              color:"white",
              cursor:"pointer"
            }}>
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;