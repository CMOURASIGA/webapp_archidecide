
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import InstructionsPage from './pages/InstructionsPage.tsx';
import ProjectProfilePage from './pages/ProjectProfilePage.tsx';
import ProjectPlansPage from './pages/ProjectPlansPage.tsx';
import ProjectTemplatesPage from './pages/ProjectTemplatesPage.tsx';
import ProjectReportPage from './pages/ProjectReportPage.tsx';
import SettingsGeminiPage from './pages/SettingsGeminiPage.tsx';
import { useProjectStore } from './store/useProjectStore.ts';

const App: React.FC = () => {
  const { loadInitialData } = useProjectStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/projects/:projectId/profile" element={<ProjectProfilePage />} />
          <Route path="/projects/:projectId/plans" element={<ProjectPlansPage />} />
          <Route path="/projects/:projectId/templates" element={<ProjectTemplatesPage />} />
          <Route path="/projects/:projectId/report" element={<ProjectReportPage />} />
          <Route path="/settings/gemini" element={<SettingsGeminiPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
