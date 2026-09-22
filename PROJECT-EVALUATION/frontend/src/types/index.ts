// Java Backend DTO Mappings

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    role: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    ownerId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectRequest {
    name: string;
    description?: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: string;
}

export type StoryPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type StoryStatus = 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'REJECTED';
export type AiRefinementStatus = 'NOT_ANALYZED' | 'ANALYZING' | 'REFINEMENT_REQUIRED' | 'READY' | 'FAILED';

export interface Story {
    id: number;
    projectId: number;
    createdBy: number;
    title: string;
    description: string;
    acceptanceCriteria: string;
    priority: StoryPriority;
    status: StoryStatus;
    storyPoints: number;
    aiRefinementStatus: AiRefinementStatus;
    aiQualityScore: number;
    aiRefinementSummary: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStoryRequest {
    title: string;
    description: string;
    priority?: StoryPriority;
    status?: StoryStatus;
    storyPoints?: number;
    qualityScore?: number; // In legacy code. We should omit or send 0.
}

export interface UpdateStoryRequest {
    title?: string;
    description?: string;
    acceptanceCriteria?: string;
    priority?: StoryPriority;
    status?: StoryStatus;
    storyPoints?: number;
    aiRefinementStatus?: AiRefinementStatus;
    aiQualityScore?: number;
    aiRefinementSummary?: string;
}

// Python AI Service DTO Mappings (matches app/schemas/refinement_schema.py)

export interface AIAnalysisResult {
    ambiguities: string[];
    missingInformation: string[];
    issues: string[];
    investViolations: string[];
}

export interface AIRefinedStoryResult {
    title: string;
    description: string;
    acceptanceCriteria: string[];
}

export interface AIValidationResult {
    valid: boolean;
    issues: string[];
}

export interface AIQualityBreakdown {
    clarity: number;
    specificity: number;
    testability: number;
    completeness: number;
    invest: number;
}

export interface AIQualityResult {
    score: number;
    level: string; // "POOR" | "NEEDS_IMPROVEMENT" | "GOOD" | "EXCELLENT"
    breakdown: AIQualityBreakdown;
}

export interface AIProviderStatus {
    analysis: string; // "SUCCESS" | "FAILED" | "PENDING"
    refinement: string;
    validation: string;
}

export interface AIProviderInfo {
    analysis: string; // e.g. "groq"
    refinement: string; // e.g. "gemini"
    validation: string; // e.g. "ollama"
}

export interface AIPipelineResponse {
    storyId: number;
    originalStory: any;
    analysis: AIAnalysisResult;
    refinedStory: AIRefinedStoryResult;
    validation: AIValidationResult;
    quality: AIQualityResult;
    providers: AIProviderInfo;
    providerStatus: AIProviderStatus;
}
