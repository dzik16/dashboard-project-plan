export interface Project {
  project: string;
  start_date: string;
  finish_date: string;
  total_tasks: number;
  kompleksitas: number;
  tasks: string[];
}

export interface Person {
  fullname: string;
  projects: Project[];
}

export interface ProjectData {
  people: Person[];
}

export interface ProjectCardsSliderProps {
  projectsData: ProjectData;
}