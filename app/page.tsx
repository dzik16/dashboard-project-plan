import ProjectCardsSlider from '@/components/ProjectCardsSlider';
import projectsData from '@/data/projects.json';

export default function Page() {
  return <ProjectCardsSlider projectsData={projectsData} />;
}