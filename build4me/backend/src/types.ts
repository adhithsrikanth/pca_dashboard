// Request and response types for the API

export interface CarpentryProjectRequest {
  projectType: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  material?: string;
  budget?: number;
  skillLevel?: string;
  additionalRequirements?: string;
  [key: string]: any; // Allow for additional fields from frontend
}

export interface Part {
  name: string;
  quantity: number;
  price: number;
  currency?: string;
  link?: string;
  description?: string;
  alternatives?: Part[];
}

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  tools?: string[];
  materials?: string[];
  estimatedTime?: string;
  warnings?: string[];
}

export interface CarpentryProjectResponse {
  projectName: string;
  overview: string;
  estimatedTotalCost: number;
  currency?: string;
  estimatedTotalTime?: string;
  steps: Step[];
  parts: Part[];
  tools: string[];
  tips?: string[];
}

