import "./css/App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Dashboard from "./page/Dashboard";
import AccidentExplorer from "./page/AccidentExplorer";
import AccidentCounter from "./page/AccidentCounter";
import AccidentRate from "./page/AccidentRate";
import AccidentFirstyear from "./page/AccidentFirstyear";
import TrendChart from "./page/TrendChart";
import Population from "./page/Population";
import Region from "./page/Region";
import Metadata from "./page/Metadata";
import Intro from "./page/Intro";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { div } from "motion/react-client";

function App() {
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(() => location.pathname === "/");

  const handleEnter = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key={showIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div onClick={handleEnter}>
              <Intro />
            </div>
          </motion.div>
        ) : (
          <>
            <Sidebar />
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <main className="main-content">
                <Routes location={location}>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/accidentExplorer"
                    element={<AccidentExplorer />}
                  />
                  <Route
                    path="/accidentCounter"
                    element={<AccidentCounter />}
                  />
                  <Route path="/accidentRate" element={<AccidentRate />} />
                  <Route
                    path="/accidentFirstyear"
                    element={<AccidentFirstyear />}
                  />
                  <Route path="/accidentTrendChart" element={<TrendChart />} />
                  <Route path="/population" element={<Population />} />
                  <Route path="/region" element={<Region />} />
                  <Route path="/metadata" element={<Metadata />} />
                </Routes>
              </main>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
