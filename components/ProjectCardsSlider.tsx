"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Zap,
  Briefcase,
} from "lucide-react";
import { Person, ProjectCardsSliderProps } from "@/types/project";

const ProjectCardsSlider: React.FC<ProjectCardsSliderProps> = ({
  projectsData,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { people } = projectsData || { people: [] };

  // Get total stats for a person across all projects
  const getPersonStats = (person: Person) => {
    const totalProjects = person.projects.length;
    const totalTasks = person.projects.reduce(
      (sum, p) => sum + p.total_tasks,
      0
    );
    const avgComplexity = Math.round(
      person.projects.reduce((sum, p) => sum + p.kompleksitas, 0) /
      totalProjects
    );

    const allStartDates = person.projects
      .map((p) => p.start_date)
      .filter(Boolean);
    const allFinishDates = person.projects
      .map((p) => p.finish_date)
      .filter(Boolean);

    const earliestStart =
      allStartDates.length > 0 ? allStartDates.sort()[0] : "";
    const latestFinish =
      allFinishDates.length > 0
        ? allFinishDates.sort().reverse()[0]
        : "";

    return {
      totalProjects,
      totalTasks,
      avgComplexity,
      earliestStart,
      latestFinish,
    };
  };

  const cardsPerPage = 2;
  const totalPages = Math.ceil(people.length / cardsPerPage);


  const getComplexityColor = (level: number): string => {
    if (level <= 2) return "bg-green-500";
    if (level === 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getComplexityLabel = (level: number): string => {
    if (level <= 2) return "Low";
    if (level === 3) return "Medium";
    return "High";
  };

  const nextPage = (): void => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = (): void => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentCards = (): Person[] => {
    const startIdx = currentPage * cardsPerPage;
    return people.slice(startIdx, startIdx + cardsPerPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4F8] via-[#F3F7EC] to-[#E0F2F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#006989] to-[#008EB3] bg-clip-text text-transparent mb-4">
            Team Projects Dashboard
          </h1>
          <p className="text-[#006989]/70 text-lg">
            Track team member tasks and project complexity
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative">

          {/* LEFT BUTTON */}
          {currentPage !== 0 && (
            <button
              style={{ marginLeft: "-2.5rem" }}
              onClick={prevPage}
              disabled={totalPages <= 1}
              className="absolute left-[-30px] top-1/2 -translate-y-1/2 
                bg-[#006989] hover:bg-[#005570] disabled:bg-gray-400 
                disabled:cursor-not-allowed text-white p-4 rounded-full 
                shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {people.length !== 0 &&
              getCurrentCards().map((person, idx) => {
                const stats = getPersonStats(person);

                return (
                  <div
                    key={idx}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#006989]/20 hover:border-[#006989] hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b-2 border-[#006989]/10">
                      <div className="relative">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.fullname}`}
                          alt={person.fullname}
                          className="w-24 h-24 rounded-full border-4 border-[#006989] shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#006989] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          #{idx + 1 + currentPage * cardsPerPage}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-[#006989] capitalize">
                          {person.fullname}
                        </h2>
                        <p className="text-[#006989]/60 text-sm mt-1 font-medium flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {stats.totalProjects}{" "}
                          {stats.totalProjects === 1 ? "Project" : "Projects"}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-[#E8F4F8] to-[#D4EAF0] rounded-xl p-4 border-2 border-[#006989]/20 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#006989]" />
                          <span className="text-[#006989]/70 text-sm font-medium">
                            Total Tasks
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-[#006989]">
                          {stats.totalTasks}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-[#E8F4F8] to-[#D4EAF0] rounded-xl p-4 border-2 border-[#006989]/20 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-[#006989]" />
                          <span className="text-[#006989]/70 text-sm font-medium">
                            Avg Complexity
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold shadow-md ${getComplexityColor(
                            stats.avgComplexity
                          )}`}
                        >
                          {getComplexityLabel(stats.avgComplexity)}
                        </span>
                      </div>
                    </div>

                    {/* Projects */}
                    <h3 className="text-[#006989] font-bold text-lg mb-4 flex items-center gap-2">
                      Projects
                      <span className="text-xs bg-gradient-to-r from-[#006989] to-[#008EB3] text-white px-3 py-1 rounded-full shadow-md">
                        {person.projects.length}
                      </span>
                    </h3>

                    <div className="max-h-[11.8rem] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {person.projects.map((project, projectIdx) => (
                        <div
                          key={projectIdx}
                          className="bg-gradient-to-br from-[#F0F9FB] to-[#E8F4F8] rounded-xl p-5 border-2 border-[#006989]/20 hover:border-[#006989] hover:shadow-md transition-all duration-300"
                        >
                          {/* Project Header */}
                          <div className="mb-3 pb-3 border-b border-[#006989]/10">
                            <h4 className="text-[#006989] font-bold capitalize mb-2 flex items-center gap-2">
                              <div className="bg-[#006989] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                {projectIdx + 1}
                              </div>
                              {project.project}
                            </h4>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 text-[#006989]/70">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {project.start_date} → {project.finish_date}
                                </span>
                              </div>

                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getComplexityColor(
                                  project.kompleksitas
                                )}`}
                              >
                                {getComplexityLabel(project.kompleksitas)}
                              </span>
                            </div>
                          </div>

                          {/* Tasks Count */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-[#006989]" />
                              <span className="text-[#006989] text-sm font-semibold">
                                {project.total_tasks}{" "}
                                {project.total_tasks === 1 ? "Task" : "Tasks"}
                              </span>
                            </div>
                          </div>

                          {/* Tasks List */}
                          <div className="space-y-2">
                            {project.tasks.map((task, taskIdx) => (
                              <div
                                key={taskIdx}
                                className="bg-white/60 rounded-lg p-2 text-xs text-[#006989] capitalize flex items-start gap-2"
                              >
                                <span className="text-[#006989]/50 font-bold min-w-[20px]">
                                  {taskIdx + 1}.
                                </span>
                                <span className="flex-1">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>


          {/* RIGHT BUTTON */}
          {currentPage !== totalPages - 1 && (
            <button
              style={{ marginRight: "-2.5rem" }}
              onClick={nextPage}
              disabled={totalPages <= 1}
              className="absolute right-[-30px] top-1/2 -translate-y-1/2 
                bg-[#006989] hover:bg-[#005570] disabled:bg-gray-400 
                disabled:cursor-not-allowed text-white p-4 rounded-full 
                shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Page Indicator */}
        {totalPages > 1 && (
          <div className="text-center mt-8">
            <p className="text-[#006989]/50 text-sm">
              Page {currentPage + 1} of {totalPages} • Showing{" "}
              {getCurrentCards().length} of {people.length} people
            </p>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES → allowed in Client Component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 105, 137, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 105, 137, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 105, 137, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ProjectCardsSlider;
