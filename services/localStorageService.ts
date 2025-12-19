
import { Project, GeminiConfig } from '../types/project';

const PROJECTS_KEY = "archidecide_projects";
const GEMINI_CONFIG_KEY = "archidecide_gemini_config";

export const localStorageService = {
  loadProjects: (): Project[] => {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProjects: (projects: Project[]) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  loadGeminiConfig: (): GeminiConfig | null => {
    const data = localStorage.getItem(GEMINI_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveGeminiConfig: (config: GeminiConfig) => {
    localStorage.setItem(GEMINI_CONFIG_KEY, JSON.stringify(config));
  }
};
