import { useEffect, useState } from 'react';
import { projectApi } from '../api/projectApi';
import { storyApi } from '../api/storyApi';
import { Link } from 'react-router-dom';
import { FolderKanban, Activity, CheckCircle, Clock, Loader2 } from 'lucide-react';
import type { Project } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeStories: 0,
    awaitingRefinement: 0,
    avgScore: 0,
    recentProjects: [] as Project[],
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projects = await projectApi.getProjects();
        
        let totalStories = 0;
        let awaitingRefinement = 0;
        let totalScore = 0;
        let scoredStoriesCount = 0;

        // Fetch stories for all projects to calculate stats
        // In a real production app with thousands of projects, this should be done via a dedicated backend aggregation endpoint.
        const storyPromises = projects.map(p => storyApi.getProjectStories(p.id));
        const allStoriesArray = await Promise.all(storyPromises);
        
        allStoriesArray.forEach(projectStories => {
          totalStories += projectStories.length;
          projectStories.forEach(story => {
            if (story.aiRefinementStatus === 'NOT_ANALYZED' || !story.aiRefinementStatus) {
              awaitingRefinement++;
            }
            if (story.aiQualityScore && story.aiQualityScore > 0) {
              totalScore += story.aiQualityScore;
              scoredStoriesCount++;
            }
          });
        });

        const avgScore = scoredStoriesCount > 0 ? Math.round(totalScore / scoredStoriesCount) : 0;

        // Sort by updatedAt descending
        const sortedProjects = [...projects].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setStats({
          totalProjects: projects.length,
          activeStories: totalStories,
          awaitingRefinement,
          avgScore,
          recentProjects: sortedProjects.slice(0, 5),
          loading: false,
          error: ''
        });
      } catch (error: any) {
        console.error("Failed to load dashboard data", error);
        setStats(s => ({ ...s, loading: false, error: 'Failed to load dashboard statistics. Please try again.' }));
      }
    };
    fetchDashboardData();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p>Loading dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {stats.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
          {stats.error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mr-4 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Projects</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalProjects}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Stories</p>
            <p className="text-2xl font-bold text-slate-900">{stats.activeStories}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mr-4 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Awaiting Refinement</p>
            <p className="text-2xl font-bold text-slate-900">{stats.awaitingRefinement}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg AI Score</p>
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold text-slate-900">{stats.avgScore}</p>
              <p className="text-sm text-slate-500 font-medium">/ 100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        <div className="divide-y divide-slate-200">
          {stats.recentProjects.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FolderKanban className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">No projects yet</p>
              <p className="mt-1">Create your first project to get started.</p>
              <Link to="/projects?create=true" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                Go to Projects
              </Link>
            </div>
          ) : (
            stats.recentProjects.map(project => (
              <div key={project.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <Link to={`/projects/${project.id}`} className="text-lg font-medium text-primary-600 hover:underline">
                    {project.name}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description || 'No description provided'}</p>
                </div>
                <div className="text-sm font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full shrink-0">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
