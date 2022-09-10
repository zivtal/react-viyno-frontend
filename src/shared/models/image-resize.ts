interface Crop {
  ratio: number;
  y?: number;
  x?: number;
}

interface Resize {
  quality?: number;
  type?: string;
  crop?: Crop;
}

export type ImageResize = Resize & { megaPixel?: number };

export type BulkImageResize = Resize & { megaPixel: number };
