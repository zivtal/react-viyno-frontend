const CANVAS_QUALITY = <const>[0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
type CanvasQuality = typeof CANVAS_QUALITY[number];

interface Crop {
  ratio: number;
  y?: number;
  x?: number;
}

interface Resize {
  quality?: CanvasQuality;
  type?: string;
  crop?: Crop;
}

export type ImageResize = Resize & { megaPixel?: number };

export type BulkImageResize = Resize & { megaPixel: number };
