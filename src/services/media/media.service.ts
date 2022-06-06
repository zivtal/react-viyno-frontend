// @ts-ignore
import { httpService } from "../http-client/http.service";
import { ImageList } from "./models/media";

function type(file: string): string | null {
  const ext = file?.split(".");

  return ext ? ext[ext.length - 1] : null;
}

export function getImgSrcFromBase64(data: string, type?: string): string {
  if (!data) {
    return "";
  }

  return `data:image/${type};base64,${data}`;
}

export async function loadFile(
  file: File
): Promise<string | ArrayBuffer | null> {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
}

function dataToFile(data: string, type: string): any {
  if (!data) {
    return;
  }

  const blob = atob(data.split(",")[1]);
  const array = [];

  for (let i = 0; i < blob.length; i++) {
    array.push(blob.charCodeAt(i));
  }

  return new Blob([new Uint8Array(array)], { type: `image/${type}` });
}

export async function loadImage(file: File): Promise<HTMLImageElement> {
  const data = await loadFile(file);

  return await new Promise((resolve) => {
    const img: HTMLImageElement = new Image();
    img.src = data as string;
    img.onload = () => {
      resolve(img);
    };
  });
}

export async function resizeImage(file: File, size: number): Promise<string> {
  const img = await loadImage(file);

  const imgWidth = img.width,
    imgHeight = img.height;

  const ratio =
    size / imgWidth < size / imgHeight ? size / imgWidth : size / imgHeight;

  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");

  const canvasCopy = document.createElement("canvas");
  const copyContext = canvasCopy.getContext("2d");

  const canvasCopy2 = document.createElement("canvas");
  const copyContext2 = canvasCopy2.getContext("2d");

  canvasCopy.width = imgWidth;
  canvasCopy.height = imgHeight;
  copyContext?.drawImage(img, 0, 0);

  canvasCopy2.width = imgWidth;
  canvasCopy2.height = imgHeight;
  copyContext2?.drawImage(
    canvasCopy,
    0,
    0,
    canvasCopy.width,
    canvasCopy.height,
    0,
    0,
    canvasCopy2.width,
    canvasCopy2.height
  );

  const rounds = 1;
  const roundRatio = ratio * rounds;

  [...Array(rounds)]
    .map((_, i) => i + 1)
    .forEach((index) => {
      canvasCopy.width = (imgWidth * roundRatio) / index;
      canvasCopy.height = (imgHeight * roundRatio) / index;

      copyContext?.drawImage(
        canvasCopy2,
        0,
        0,
        canvasCopy2.width,
        canvasCopy2.height,
        0,
        0,
        canvasCopy.width,
        canvasCopy.height
      );

      canvasCopy2.width = (imgWidth * roundRatio) / index;
      canvasCopy2.height = (imgHeight * roundRatio) / index;
      copyContext2?.drawImage(
        canvasCopy,
        0,
        0,
        canvasCopy.width,
        canvasCopy.height,
        0,
        0,
        canvasCopy2.width,
        canvasCopy2.height
      );
    });

  canvas.width = (imgWidth * roundRatio) / rounds;
  canvas.height = (imgHeight * roundRatio) / rounds;

  canvasContext?.drawImage(
    canvasCopy2,
    0,
    0,
    canvasCopy2.width,
    canvasCopy2.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL(file.type);
}

export async function imageUpload(
  file: File,
  max = [1280]
): Promise<ImageList> {
  const data = (await Promise.all(
    Array.prototype.map.call(max, async (size): Promise<string> => {
      const image = await resizeImage(file, size);
      return image.substring(image.indexOf(",") + 1);
    })
  )) as Array<string>;

  return {
    ...(({ name, type, lastModified }) => ({ name, type, lastModified }))(file),
    data,
    extension: type(file.name) || "png",
  };
}

export async function cloudUpload(files: FileList, type: string): Promise<any> {
  const res = await Promise.all(
    Array.prototype.map.call(files, async (file) => {
      try {
        const FORM_DATA = new FormData();
        switch (type) {
          case "image":
            const data = await resizeImage(file, 1280);
            // @ts-ignore
            const blob = dataToFile(data);
            FORM_DATA.append(type, blob || file);
            break;
          default:
            FORM_DATA.append(type, file);
            break;
        }
        const res = await httpService.post("upload", FORM_DATA);

        return res?.https || res?.http;
      } catch (err) {
        console.error("ERROR!", err);

        return [];
      }
    })
  );

  return res;
}
