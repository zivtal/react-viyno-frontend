import { ImageDimensions } from "../models/image-dimensions";
import { BulkImageResize, ImageResize } from "../models/image-resize";
import FileService from "./file.service";

export default class ImageService {
  public static fromBase64(data?: string, type: string = "png"): string {
    if (!data) {
      return "";
    }

    return `data:image/${type};base64,${data}`;
  }

  private static calcCrop(
    { width, height }: ImageDimensions,
    crop: number
  ): number {
    return Math.min(height, width) / crop;
  }

  private static calcByMegaPixel(
    { width, height }: ImageDimensions,
    megaPixel: number,
    upscale = false
  ): number {
    const ratioHeight = height / width;
    const calcHeight = Math.sqrt(megaPixel * 1000000 * ratioHeight);

    return upscale ? calcHeight / height : Math.min(calcHeight / height, 1);
  }

  private static async loadImageFile(file: File): Promise<HTMLImageElement> {
    const data = await FileService.toBase64(file);

    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.src = data as string;
      img.onload = () => resolve(img);
      img.onerror = () => reject();
    });
  }

  public static async resize(
    file: File,
    { megaPixel, quality, type, crop }: ImageResize
  ): Promise<File> {
    const img = await this.loadImageFile(file);
    const { width, height } = img;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const canvasCopy1 = document.createElement("canvas");
    const copyContext1 = canvasCopy1.getContext("2d");

    const canvasCopy2 = document.createElement("canvas");
    const copyContext2 = canvasCopy2.getContext("2d");

    const calcRatio = megaPixel
      ? this.calcByMegaPixel({ width, height }, megaPixel) || 1
      : 1;

    canvasCopy1.width = width;
    canvasCopy1.height = height;
    copyContext1?.drawImage(img, 0, 0);

    canvasCopy2.width = width;
    canvasCopy2.height = height;
    copyContext2?.drawImage(
      canvasCopy1,
      0,
      0,
      canvasCopy1.width,
      canvasCopy1.height,
      0,
      0,
      canvasCopy2.width,
      canvasCopy2.height
    );

    const rounds = 2;
    const roundRatio = calcRatio * rounds;

    [...Array(rounds)]
      .map((_, i) => i + 1)
      .forEach((index) => {
        canvasCopy1.width = (width * roundRatio) / index;
        canvasCopy1.height = (height * roundRatio) / index;
        copyContext1?.drawImage(
          canvasCopy2,
          0,
          0,
          canvasCopy2.width,
          canvasCopy2.height,
          0,
          0,
          canvasCopy1.width,
          canvasCopy1.height
        );

        canvasCopy2.width = (width * roundRatio) / index;
        canvasCopy2.height = (height * roundRatio) / index;
        copyContext2?.drawImage(
          canvasCopy1,
          0,
          0,
          canvasCopy1.width,
          canvasCopy1.height,
          0,
          0,
          canvasCopy2.width,
          canvasCopy2.height
        );
      });

    canvas.width = width * calcRatio;
    canvas.height = height * calcRatio;

    const top = crop?.y ? crop.y / 100 : 0.5;
    const left = crop?.x ? crop.x / 100 : 0.5;
    const sw =
      crop && canvas.width > canvas.height
        ? this.calcCrop(canvas, crop.ratio)
        : canvas.width;
    const sh =
      crop && canvas.width < canvas.height
        ? this.calcCrop(canvas, crop.ratio)
        : canvas.height;
    const sx = (canvas.width - sw) * left;
    const sy = (canvas.height - sh) * top;

    canvas.width = sw;
    canvas.height = sh;
    context?.drawImage(canvasCopy2, sx, sy, sw, sh, 0, 0, sw, sh);

    return FileService.toFile(
      canvas.toDataURL(type || file.type, quality || 0.9),
      file
    );
  }

  public static async bulkResize(
    file: File,
    options: Array<BulkImageResize>
  ): Promise<Array<File>> {
    const bulk: { [key: number]: File } = {};

    for (const params of [...options].sort(
      ({ megaPixel: a }, { megaPixel: b }) => b - a
    )) {
      const values = Object.values(bulk);
      const source = values[values.length - 1] || file;
      const { megaPixel } = params;
      bulk[megaPixel] = await this.resize(source, params);
    }

    return options.map(({ megaPixel }): File => bulk[megaPixel]);
  }
}
