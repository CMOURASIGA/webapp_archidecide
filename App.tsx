
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import LandingPage from './pages/LandingPage.tsx';
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
        {/* Rota da Tela Inicial (Fora do Layout Principal) */}
        <Route path="/" element={<LandingPage />} />

        {/* Rotas do Sistema (Dentro do Layout com Sidebar) */}
        <Route element={<MainLayout />}>
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
