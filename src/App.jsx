import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div>
      {activePage === "home" && <Dashboard />}
      {activePage === "trading" && <Trading />}

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md justify-around py-3 text-xs font-bold text-slate-400">

          <button
            onClick={() => setActivePage("home")}
            className={activePage === "home" ? "text-slate-900" : ""}
          >
            Home
          </button>

          <button>
            Gym
          </button>

          <button
            onClick={() => setActivePage("trading")}
            className={activePage === "trading" ? "text-slate-900" : ""}
          >
            Trading
          </button>

          <button>
            Fap Penality
          </button>

        </div>
      </nav>
    </div>
  );
}

export default App;