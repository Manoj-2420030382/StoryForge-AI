import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import { storyApi } from '../api/storyApi';
import { Plus, ArrowLeft, Loader2, Sparkles, BookOpen, X, Trash2, Download } from 'lucide-react';
import type { Project, Story, StoryPriority } from '../types';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '', priority: 'MEDIUM' as StoryPriority, storyPoints: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState({ name: '', description: '' });
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectError, setEditProjectError] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const fetchProjectData = React.useCallback(async () => {
    if (!projectId) return;
    try {
      setError('');
      const pData = await projectApi.getProject(projectId);
      setProject(pData);
      setEditProjectData({ name: pData.name, description: pData.description });
      const sData = await storyApi.getProjectStories(projectId);
      setStories(sData);
    } catch (error: any) {
      console.error("Failed to load project details", error);
      setError("Unable to load project details. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await storyApi.createStory(projectId!, { ...newStory, status: 'DRAFT' });
      setIsModalOpen(false);
      setNewStory({ title: '', description: '', priority: 'MEDIUM', storyPoints: 0 });
      fetchProjectData();
    } catch (error: any) {
      console.error("Failed to create story", error);
      setSubmitError(error.response?.data?.message || 'Failed to create story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditProjectError('');
    setIsEditingProject(true);
    try {
      const updated = await projectApi.updateProject(projectId!, editProjectData);
      setProject(updated);
      setIsEditProjectModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update project", error);
      setEditProjectError(error.response?.data?.message || 'Failed to update project.');
    } finally {
      setIsEditingProject(false);
    }
  };
  
  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project and all its stories? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await projectApi.deleteProject(projectId!);
      navigate('/projects');
    } catch (error: any) {
      console.error("Failed to delete project", error);
      alert(error.response?.data?.message || "Failed to delete project");
      setIsDeleting(false);
    }
  };
  
  const handleDeleteStory = async (storyId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }
    
    try {
      await storyApi.deleteStory(projectId!, storyId);
      setStories(stories.filter(s => s.id !== storyId));
    } catch (error: any) {
      console.error("Failed to delete story", error);
      alert(error.response?.data?.message || "Failed to delete story");
    }
  };

  const handleExportProject = async () => {
    setExportError('');
    setIsExporting(true);
    try {
      const blob = await projectApi.exportProjectDocx(projectId!);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      const safeProjectName = project?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project';
      link.setAttribute('download', `StoryForge_AI_${safeProjectName}_Report.docx`);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      setIsExportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to export project", error);
      setExportError("Unable to generate the project report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score > 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Link to="/projects" className="flex items-center hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
        </div>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 font-medium text-center">
          {error || 'Project not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <Link to="/projects" className="flex items-center hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleDeleteProject}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
            aria-label="Delete project"
          >
            <Trash2 className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
          <button
            onClick={() => setIsEditProjectModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            Edit Project
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Story
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Project Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
            User Stories
          </h2>
          <span className="bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-xs font-semibold">
            {stories.length}
          </span>
        </div>
        
        {stories.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900">No stories yet</p>
            <p className="mt-1">Add a user story to get started with AI refinement.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {stories.map(story => (
              <Link 
                to={`/projects/${projectId}/stories/${story.id}`}
                key={story.id} 
                className="block p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-medium text-slate-900 group-hover:text-primary-600">{story.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {story.status?.replace(/_/g, ' ') || 'DRAFT'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getQualityColor(story.aiQualityScore || 0)}`}>
                        Quality: {story.aiQualityScore || 'N/A'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        story.aiRefinementStatus === 'READY' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {story.aiRefinementStatus?.replace(/_/g, ' ') || 'NOT REFINED'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{story.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => handleDeleteStory(story.id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete story"
                      aria-label="Delete story"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/projects/${projectId}/stories/${story.id}/refine`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Refine
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>

            <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900">Add User Story</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleCreateStory}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 space-y-4">
                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                      {submitError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Title *</label>
                    <input
                      type="text"
                      required
                      value={newStory.title}
                      onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g. As a user, I want to login..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={newStory.description}
                      onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Provide the raw requirement. The AI will help refine this."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Priority</label>
                      <select
                        value={newStory.priority}
                        onChange={(e) => setNewStory({...newStory, priority: e.target.value as StoryPriority})}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Story Points (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newStory.storyPoints}
                        onChange={(e) => setNewStory({...newStory, storyPoints: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || !newStory.title.trim()}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Story
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditProjectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsEditProjectModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>

            <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900">Edit Project</h3>
                  <button onClick={() => setIsEditProjectModalOpen(false)} className="text-slate-400 hover:text-slate-500 focus:outline-none rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleUpdateProject}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4">
                  {editProjectError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                      {editProjectError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={editProjectData.name}
                      onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={editProjectData.description}
                      onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isEditingProject || !editProjectData.name.trim()}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isEditingProject ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditProjectModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsExportModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>

            <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900">Export Project Report</h3>
                  <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-500 focus:outline-none rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4">
                {exportError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {exportError}
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Project:</p>
                  <p className="text-base font-bold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">{project.name}</p>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm font-medium text-slate-700 mb-2">The report will contain:</p>
                  <ul className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Project information and statistics</li>
                    <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Original user stories and acceptance criteria</li>
                    <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> AI refinement summaries and scores</li>
                    <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Refined user stories</li>
                    <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Story priorities and statuses</li>
                  </ul>
                </div>
                
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4">
                  <span className="text-sm font-medium text-slate-700">Format:</span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">DOCX</span>
                </div>
              </div>
              
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleExportProject}
                  disabled={isExporting}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  {isExporting ? 'Generating Report...' : 'Generate DOCX'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
