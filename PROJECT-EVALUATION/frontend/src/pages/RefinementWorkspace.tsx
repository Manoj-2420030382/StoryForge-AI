import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi } from '../api/storyApi';
import { aiApi } from '../api/aiApi';
import { ArrowLeft, Sparkles, Loader2, Check, AlertTriangle, Play, Save, CheckCircle } from 'lucide-react';
import type { Story, AIPipelineResponse } from '../types';

const RefinementWorkspace = () => {
  const { projectId, storyId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [refining, setRefining] = useState(false);
  const [result, setResult] = useState<AIPipelineResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchStory = React.useCallback(async () => {
    if (!projectId || !storyId) return;
    try {
      setError('');
      const data = await storyApi.getStory(projectId, storyId);
      setStory(data);
    } catch (error) {
      console.error("Failed to load story", error);
      setError('Unable to load story details. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  }, [projectId, storyId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const handleRefine = async () => {
    if (!story) return;
    setRefining(true);
    setResult(null);
    setSaveSuccess(false);
    setError('');
    
    try {
      const data = await aiApi.refineStory({
        storyId: story.id,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria || ''
      });
      setResult(data);
    } catch (error: any) {
      console.error("Refinement failed", error);
      setError(error.response?.data?.detail || error.response?.data?.message || "AI Refinement failed. Check backend logs.");
    } finally {
      setRefining(false);
    }
  };

  const handleSaveToBackend = async () => {
    if (!result || !story) return;
    setSaving(true);
    try {
      const updatedData = {
        title: result.refinedStory.title,
        description: result.refinedStory.description,
        acceptanceCriteria: result.refinedStory.acceptanceCriteria.map((c: string) => '- ' + c).join('\n'),
        status: 'READY' as const,
        aiQualityScore: result.quality.score,
        aiRefinementStatus: 'READY' as const,
        aiRefinementSummary: `Quality: ${result.quality.level} (${result.quality.score}/100). ` +
          `Clarity: ${result.quality.breakdown.clarity}, ` +
          `Specificity: ${result.quality.breakdown.specificity}, ` +
          `Testability: ${result.quality.breakdown.testability}, ` +
          `Completeness: ${result.quality.breakdown.completeness}.`
      };
      await storyApi.updateStory(projectId!, storyId!, updatedData);
      setSaveSuccess(true);
      fetchStory();
    } catch (error: any) {
      console.error("Failed to save refined story", error);
      const detail = error.response?.data?.message || error.response?.data?.detail || error.message;
      setError(`Failed to save changes to the backend. Error: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getStatusColor = (status: string) => {
    if (status === 'SUCCESS') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'PENDING') return 'bg-slate-50 border-slate-200 text-slate-600';
    return 'bg-red-50 border-red-200 text-red-700';
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  if (error && !story) {
    return (
      <div className="space-y-6">
        <Link to={`/projects/${projectId}/stories/${storyId}`} className="flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Story
        </Link>
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 font-medium text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-shrink-0 gap-4">
        <div className="flex items-center">
          <Link to={`/projects/${projectId}/stories/${storyId}`} className="p-2 hover:bg-slate-200 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Sparkles className="w-6 h-6 text-primary-500 mr-2" />
            AI Refinement Workspace
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {result && (
            <button
              onClick={handleSaveToBackend}
              disabled={saving || saveSuccess}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                saveSuccess 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saveSuccess ? 'Saved' : 'Apply Changes'}
            </button>
          )}
          {saveSuccess && (
            <Link
              to={`/projects/${projectId}/stories/${storyId}`}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors"
            >
              View Updated Story
            </Link>
          )}
          <button
            onClick={handleRefine}
            disabled={refining}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70"
          >
            {refining ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            Run AI Pipeline
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Original Story */}
        <div className="md:w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex-shrink-0 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-700">Original Story</h2>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
              {story.status?.replace(/_/g, ' ') || 'BACKLOG'}
            </span>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
              <h3 className="text-lg font-medium text-slate-900 mt-1">{story.title}</h3>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <div className="mt-2 text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                {story.description}
              </div>
            </div>
            {story.acceptanceCriteria && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acceptance Criteria</label>
                <div className="mt-2 text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {story.acceptanceCriteria}
                </div>
              </div>
            )}
            
            {story.aiRefinementSummary && !result && (
              <div className="mt-6">
                <label className="text-xs font-bold text-primary-600 uppercase tracking-wider flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Previous AI Feedback
                </label>
                <div className="mt-2 text-slate-700 whitespace-pre-wrap bg-primary-50 p-4 rounded-lg border border-primary-100 text-sm italic">
                  "{story.aiRefinementSummary}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Result */}
        <div className="md:w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full relative">
          <div className="bg-gradient-to-r from-primary-50 to-indigo-50 px-6 py-4 border-b border-primary-100 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-semibold text-primary-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary-500" />
              Refined Output
            </h2>
            {result && (
              <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                <span className="text-sm font-semibold text-slate-700 mr-2">Quality:</span>
                <div className={`flex items-center px-2 py-0.5 rounded-full font-bold text-sm ${getQualityBg(result.quality.score)} ${getQualityColor(result.quality.score)}`}>
                  {result.quality.score}/100
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
            {refining ? (
              <div className="h-full flex flex-col items-center justify-center text-primary-600 space-y-6">
                <Loader2 className="w-12 h-12 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium animate-pulse">Multi-Agent Pipeline Running...</p>
                  <p className="text-sm text-slate-500 mt-2">Engaging specialized AI agents to analyze, rewrite, and validate.</p>
                </div>
                <div className="flex space-x-2 text-sm text-slate-500 mt-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <span className="font-medium text-slate-700">Analyst</span>
                  <span>→</span>
                  <span className="font-medium text-slate-700">Refiner</span>
                  <span>→</span>
                  <span className="font-medium text-slate-700">Validator</span>
                </div>
              </div>
            ) : !result ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Sparkles className="w-16 h-16 mb-4 text-slate-200" />
                <p className="text-lg font-medium text-slate-500">Click 'Run AI Pipeline' to start</p>
                <p className="text-sm text-center max-w-sm mt-2">
                  The agents will analyze your story, rewrite it for clarity, generate testable acceptance criteria, and validate the output.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Agent Status Bar */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between ${getStatusColor(result.providerStatus.analysis)}`}>
                    <span>Analyst ({result.providers?.analysis || 'groq'})</span>
                    {result.providerStatus.analysis === 'SUCCESS' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  </div>
                  <div className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between ${getStatusColor(result.providerStatus.refinement)}`}>
                    <span>Refiner ({result.providers?.refinement || 'gemini'})</span>
                    {result.providerStatus.refinement === 'SUCCESS' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  </div>
                  <div className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between ${getStatusColor(result.providerStatus.validation)}`}>
                    <span>Validator ({result.providers?.validation || 'ollama'})</span>
                    {result.providerStatus.validation === 'SUCCESS' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  </div>
                </div>

                {/* Quality Breakdown */}
                <div className="grid grid-cols-5 gap-2">
                  {(['clarity', 'specificity', 'testability', 'completeness', 'invest'] as const).map(metric => (
                    <div key={metric} className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <p className="text-xs font-medium text-slate-500 capitalize">{metric}</p>
                      <p className={`text-lg font-bold mt-1 ${getQualityColor(result.quality.breakdown[metric])}`}>
                        {result.quality.breakdown[metric]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Refined Content */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2 block">Refined Title</label>
                  <h3 className="text-xl font-bold text-slate-900">{result.refinedStory.title}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2 block">Refined Description</label>
                  <div className="text-slate-800 whitespace-pre-wrap">{result.refinedStory.description}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-3 block">Acceptance Criteria (BDD)</label>
                  <ul className="space-y-3">
                    {result.refinedStory.acceptanceCriteria.map((ac: string, i: number) => (
                      <li key={i} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 text-sm leading-relaxed">{ac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Validation Issues */}
                {!result.validation.valid && result.validation.issues.length > 0 && (
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                    <label className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Validator Flagged Issues
                    </label>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-800">
                      {result.validation.issues.map((issue: string, i: number) => <li key={`val-${i}`}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* Analysis Feedback */}
                {(result.analysis.ambiguities.length > 0 || result.analysis.issues.length > 0 || result.analysis.missingInformation.length > 0) && (
                  <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                    <label className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Analyst Notes (Original Story)
                    </label>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-orange-800">
                      {result.analysis.ambiguities.map((a: string, i: number) => <li key={`amb-${i}`}><strong>Ambiguity:</strong> {a}</li>)}
                      {result.analysis.issues.map((a: string, i: number) => <li key={`issue-${i}`}><strong>Issue:</strong> {a}</li>)}
                      {result.analysis.missingInformation.map((a: string, i: number) => <li key={`miss-${i}`}><strong>Missing:</strong> {a}</li>)}
                      {result.analysis.investViolations.map((a: string, i: number) => <li key={`inv-${i}`}><strong>INVEST:</strong> {a}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinementWorkspace;
