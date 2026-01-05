import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CarpentryProjectResponse } from '../types/api';

export interface BuildData {
  jobDescription: string;
  projectType: string;
  dimensions: { length: string; width: string };
  materialPreference: string;
  location: 'indoor' | 'outdoor' | '';
  qualityLevel: 'standard' | 'premium' | '';
}

interface BuildContextType {
  buildData: BuildData;
  updateBuildData: (data: Partial<BuildData>) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  projectPlan: CarpentryProjectResponse | null;
  setProjectPlan: (plan: CarpentryProjectResponse | null) => void;
  resetBuild: () => void;
}

const initialBuildData: BuildData = {
  jobDescription: '',
  projectType: '',
  dimensions: { length: '', width: '' },
  materialPreference: '',
  location: '',
  qualityLevel: '',
};

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [buildData, setBuildData] = useState<BuildData>(initialBuildData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [projectPlan, setProjectPlan] = useState<CarpentryProjectResponse | null>(null);

  const updateBuildData = (data: Partial<BuildData>) => {
    setBuildData((prev) => ({ ...prev, ...data }));
  };

  const resetBuild = () => {
    setBuildData(initialBuildData);
    setCurrentQuestionIndex(0);
    setProjectPlan(null);
  };

  return (
    <BuildContext.Provider
      value={{
        buildData,
        updateBuildData,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        projectPlan,
        setProjectPlan,
        resetBuild,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const context = useContext(BuildContext);
  if (context === undefined) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
}
