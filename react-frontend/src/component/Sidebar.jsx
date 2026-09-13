import {
  Gauge,
  CarFront,
  Users,
  MapPinHouse,
  FileText,
  ChartNoAxesCombined,
  DatabaseSearch,
  Search,
  Calculator,
  Calendar1,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import "../css/Sidebar.css";
import "../css/variables.css";
import PageHeader from "./PageHeader";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <DatabaseSearch />
        <div>
          <h5>Traffic Accidents</h5>
          <p>Integraion Platform</p>
        </div>
      </div>

      <div className="sidebar-items">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Gauge className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-group">
          <span className="sidebar-category">ANALYTICS</span>
          <NavLink
            to="/accidentExplorer"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <Search className="sidebar-icon" />
            <span>Accident Explorer</span>
          </NavLink>
          <NavLink
            to="/accidentCounter"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <Calculator className="sidebar-icon" />
            <span>Accident Counter</span>
          </NavLink>
          <NavLink
            to="/accidentRate"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <CarFront className="sidebar-icon" />
            <span>Accident Rate Ranking</span>
          </NavLink>
          <NavLink
            to="/accidentTrendChart"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <ChartNoAxesCombined className="sidebar-icon" />
            <span>Trand Chart</span>
          </NavLink>
          <NavLink
            to="/accidentFirstyear"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <Calendar1 className="sidebar-icon" />
            <span>First Year Information</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-category">PREFERENCE DATA</span>
          <NavLink
            to="/population"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <Users className="sidebar-icon" />
            <span>Population Data</span>
          </NavLink>
          <NavLink
            to="/region"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <MapPinHouse className="sidebar-icon" />
            <span>Region Search</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-category">INFORMATION</span>
          <NavLink
            to="/metadata"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <FileText className="sidebar-icon" />
            <span>Dataset Metadata</span>
          </NavLink>
        </div>
      </div>

      <div className="sidebar-footer">
        <Link
          to="https://www.govdata.de/dl-de/by-2-0"
          target="_blank"
          className="license"
        >
          <p>© 2026 Traffic Accidents</p>
          <p>Attribution – Version 2.0</p>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
