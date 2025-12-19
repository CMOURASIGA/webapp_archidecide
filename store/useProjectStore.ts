
import { create } from 'zustand';
import { Project, GeminiConfig, ReportMeta } from '../types/project';
import { localStorageService } from '../services/localStorageService';

interface ProjectState {
  projects: Project[];
  geminiConfig: GeminiConfig | null;
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadInitialData: () => void;
  setCurrentProject: (id: string | null) => void;
  createProject: (data: Partial<Project>) => void;
  updateProject: (id: string, updater: (prev: Project) => Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setGeminiConfig: (config: GeminiConfig) => void;
  addReport: (projectId: string, report: ReportMeta) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  geminiConfig: null,
  currentProjectId: null,
  isLoading: false,
  error: null,

  loadInitialData: () => {
    const projects = localStorageService.loadProjects();
    const geminiConfig = localStorageService.loadGeminiConfig();
    set({ projects, geminiConfig });
  },

  setCurrentProject: (id) => set({ currentProjectId: id }),

  createProject: (data) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      nome: data.nome || "Novo Projeto",
      cliente: data.cliente || "",
      dataProjeto: data.dataProjeto || new Date().toISOString(),
      observacoes: data.observacoes || "",
      clientProfile: null,
      propertyInfo: null,
      diretrizesGerais: null,
      planA: null,
      planB: null,
      comparison: null,
      templatesInputs: [],
      templatesResults: [],
      reports: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    const updatedProjects = [...get().projects, newProject];
    set({ projects: updatedProjects, currentProjectId: newProject.id });
    localStorageService.saveProjects(updatedProjects);
  },

  updateProject: (id, updater) => {
    const projects = get().projects.map(p => {
      if (p.id === id) {
        const updated = updater(p);
        return {
          ...updated,
          updatedAt: new Date().toISOString(),
          version: updated.version + 1
        };
      }
      return p;
    });
    set({ projects });
    localStorageService.saveProjects(projects);
  },

  deleteProject: (id) => {
    const updatedProjects = get().projects.filter(p => p.id !== id);
    set({ projects: updatedProjects, currentProjectId: null });
    localStorageService.saveProjects(updatedProjects);
  },

  duplicateProject: (id) => {
    const source = get().projects.find(p => p.id === id);
    if (!source) return;

    const copy: Project = {
      ...source,
      id: crypto.randomUUID(),
      nome: `${source.nome} (cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reports: [], // don't copy reports
      version: 1,
    };

    const updatedProjects = [...get().projects, copy];
    set({ projects: updatedProjects });
    localStorageService.saveProjects(updatedProjects);
  },

  setGeminiConfig: (config) => {
    set({ geminiConfig: config });
    localStorageService.saveGeminiConfig(config);
  },

  addReport: (projectId, report) => {
    get().updateProject(projectId, (prev) => ({
      ...prev,
      reports: [...prev.reports, report]
    }));
  }
}));
