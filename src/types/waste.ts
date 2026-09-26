export interface UpcyclingIdea {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Industrial / Advanced' | string;
}

export interface SecondaryComponent {
  componentName: string;
  material: string;
  action: string;
}

export interface EnvironmentalImpact {
  decompositionTime: string;
  carbonFootprintNote: string;
  circularEconomyPotential: string;
}

export interface WasteAnalysisResult {
  objectName: string;
  material: string;
  materialSubtype?: string;
  wasteCategory: string;
  confidenceScore: number;
  condition: string;
  reasoning: string;
  disposalMethod: string;
  disposalSteps: string[];
  binColorCode: string;
  contaminationRisks: string;
  recyclabilityRating: string;
  reuseAndUpcycling: UpcyclingIdea[];
  secondaryComponents?: SecondaryComponent[];
  environmentalImpact: EnvironmentalImpact;
  summary: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  imageUrl: string;
  result: WasteAnalysisResult;
}

export interface SampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string; // Data URL or URL
  accentColor: string;
}
