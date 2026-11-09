export type ReferenceModel = {
  modelId: string;
  position: number[];
  rotation: number[];
  scale: number;
};

export type Preset = {
  id: string;
  name: string;
  description: string;
  referenceModels: ReferenceModel[];
};
