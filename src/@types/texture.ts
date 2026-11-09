export interface TextureTransform {
  rotation: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export type TextureTransforms = Record<string, TextureTransform>;
export type TextureBackgrounds = Record<string, string>;
