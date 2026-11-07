export interface EventRecord {
  id: string;
  venueId: string;
  venueName: string;
  location: string;
  date: string; // YYYY-MM-DD
  season: 'Monsoon' | 'Summer' | 'Winter' | 'Spring' | 'Autumn';
  capacity: number;
  eventType: 'Conference' | 'Hackathon' | 'Executive Dinner' | 'Meetup' | 'Product Launch' | 'Workshop';
  budget: number;
  actualSpend?: number;
  retrospectiveNotes: string;
  incidents: string[];
  insights: string[];
  status: 'completed' | 'upcoming';
  hindsightMemoryId?: string;
  createdAt: string;
}

export interface HindsightMemoryNode {
  id: string;
  bankId: string;
  type: 'fact' | 'experience' | 'observation' | 'opinion';
  content: string;
  venueId: string;
  location: string;
  dateSeason: string;
  eventType: string;
  confidenceScore: number;
  rrfRank?: number;
  retrievalStrategy: 'dense_vector' | 'bm25_keyword' | 'graph_traversal' | 'temporal_filter';
  timestamp: string;
  metadata: {
    eventDate?: string;
    venueName?: string;
    capacity?: number;
    budget?: number;
    source?: string;
    [key: string]: any;
  };
}

export interface HindsightRecallResult {
  query: string;
  venueId?: string;
  dateRange?: {
    start?: string;
    end?: string;
    season?: string;
  };
  memories: HindsightMemoryNode[];
  retrievalSummary: string;
  executionTimeMs: number;
  source: 'hindsight_cloud' | 'hindsight_local_engine';
}

export interface PredictiveChecklistItem {
  task: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  department: 'Logistics' | 'AV & Tech' | 'Catering' | 'Venue Operations' | 'Security';
}

export interface RiskMitigationItem {
  risk: string;
  mitigation: string;
  precedent: string;
}

export interface VenueBriefing {
  venueName: string;
  location: string;
  plannedDate: string;
  capacity: number;
  eventType: string;
  budget: number;
  pastIncidents: string[];
  budgetAndVendorRecollections: string[];
  actionableRecommendations: string[];
  predictiveChecklist: PredictiveChecklistItem[];
  mitigationPlan: RiskMitigationItem[];
  recalledMemories: HindsightMemoryNode[];
  statelessComparison: {
    advice: string;
    limitations: string[];
  };
  llmProvider: string;
  modelUsed: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recalledMemories?: HindsightMemoryNode[];
  statelessContent?: string;
}

