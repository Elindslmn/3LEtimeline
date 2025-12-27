import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimusScene from './components/AnimusScene';
import CustomCursor from './components/CustomCursor';

// The new AnimusScene is a full-screen, self-contained experience.
// We can simplify the AppShell significantly to just host it.
// The router is kept in case we want to add pages like 'admin' back later.

function AppShell() {
  return (
    <div className="app-shell">
      <CustomCursor />
      {/* The AnimusScene now handles its own background, HUD, and effects */}
      <AnimusScene />
    </div>
  );
}

export default function AppRouterWrapper() {
  return (
    <BrowserRouter>
      {/* For now, we only render the main AppShell.
          If other pages are needed, they can be added here. */}
      <Routes>
        <Route path="*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}