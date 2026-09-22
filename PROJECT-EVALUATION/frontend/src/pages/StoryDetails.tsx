import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storyApi } from '../api/storyApi';
import { ArrowLeft, Loader2, Sparkles, Edit, X, Save, FileText, CheckCircle, Trash2 } from 'lucide-react';
import type { Story, StoryPriority, StoryStatus } from '../types';

const StoryDetails = () => {
  const { projectId, storyId } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStory, setEditStory] = useState<Partial<Story>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStory = React.useCallback(async () => {
    if (!projectId || !storyId) return;
    try {
      setError('');
      const data = await storyApi.getStory(projectId, storyId);
      setStory(data);
      setEditStory(data);
    } catch (error: any) {
      console.error("Failed to load story details", error);
      setError("Unable to load story details. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  }, [projectId, storyId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const updated = await storyApi.updateStory(projectId!, storyId!, {
        title: editStory.title,
        description: editStory.description,
        acceptanceCriteria: editStory.acceptanceCriteria,
        priority: editStory.priority as StoryPriority,
        status: editStory.status as StoryStatus,
        storyPoints: editStory.storyPoints
      });
      setStory(updated);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Failed to update story", error);
      setSubmitError(error.response?.data?.message || 'Failed to update story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    setIsDeleting(true);
    try {
      await storyApi.deleteStory(projectId!, storyId!);
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      console.error("Failed to delete story", error);
      alert(error.response?.data?.message || "Failed to delete story");
      setIsDeleting(false);
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
        <p>Loading story details...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="space-y-6">
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Link to={`/projects/${projectId}`} className="flex items-center hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Project
          </Link>
        </div>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 font-medium text-center">
          {error || 'Story not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-slate-500 mb-4">
        <Link to={`/projects/${projectId}`} className="flex items-center hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Project
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{story.title}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
              {story.status?.replace(/_/g, ' ') || 'DRAFT'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-semibold ${
              story.aiRefinementStatus === 'READY' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {story.aiRefinementStatus?.replace(/_/g, ' ') || 'NOT REFINED'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center">
              <span className="font-medium mr-1">Priority:</span> 
              <span className={
                story.priority === 'CRITICAL' ? 'text-red-600 font-semibold' :
                story.priority === 'HIGH' ? 'text-orange-600 font-semibold' : ''
              }>{story.priority}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-1">Points:</span> {story.storyPoints || 0}
            </div>
            {story.aiQualityScore > 0 && (
              <div className="flex items-center">
                <span className="font-medium mr-1">AI Score:</span>
                <span className={getQualityColor(story.aiQualityScore).split(' ')[0] + ' font-semibold'}>{story.aiQualityScore}/100</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-y-2">
           <button
            onClick={handleDeleteStory}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
          <button
            onClick={() => {
              setEditStory(story);
              setIsEditModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Story
          </button>
          <Link
            to={`/projects/${projectId}/stories/${storyId}/refine`}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Refine with AI
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-700 whitespace-pre-wrap">{story.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Acceptance Criteria</h2>
            </div>
            <div className="p-6">
              {story.acceptanceCriteria ? (
                <div className="text-slate-700 whitespace-pre-wrap prose prose-sm max-w-none prose-slate">
                  {story.acceptanceCriteria}
                </div>
              ) : (
                <p className="text-slate-500 italic">No acceptance criteria defined.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
            </div>
            <div className="p-6">
              {story.aiRefinementSummary ? (
                <div className="text-slate-700 text-sm whitespace-pre-wrap prose prose-sm prose-slate">
                  {story.aiRefinementSummary}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-4">This story hasn't been refined by AI yet.</p>
                  <Link
                    to={`/projects/${projectId}/stories/${storyId}/refine`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Refinement
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsEditModalOpen(false)}>
              <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>

            <div className="relative z-10 inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900">Edit User Story</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-500 focus:outline-none rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleUpdateStory}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                      value={editStory.title || ''}
                      onChange={(e) => setEditStory({...editStory, title: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={editStory.description || ''}
                      onChange={(e) => setEditStory({...editStory, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Acceptance Criteria</label>
                    <textarea
                      rows={5}
                      value={editStory.acceptanceCriteria || ''}
                      onChange={(e) => setEditStory({...editStory, acceptanceCriteria: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono text-xs"
                      placeholder="e.g. - User can login successfully"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Status</label>
                      <select
                        value={editStory.status || 'DRAFT'}
                        onChange={(e) => setEditStory({...editStory, status: e.target.value as StoryStatus})}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="READY">Ready</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Priority</label>
                      <select
                        value={editStory.priority || 'MEDIUM'}
                        onChange={(e) => setEditStory({...editStory, priority: e.target.value as StoryPriority})}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Story Points</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editStory.storyPoints || 0}
                        onChange={(e) => setEditStory({...editStory, storyPoints: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || !editStory.title?.trim()}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetails;
