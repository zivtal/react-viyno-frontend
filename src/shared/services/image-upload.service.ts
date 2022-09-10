import { ImageList } from "../models/image-list";
import ImageService from "./image.service";
import FileService from "./file.service";

export async function imageUpload(
  file: File,
  megaPixel = [2]
): Promise<ImageList> {
  const data = (await Promise.all(
    Array.prototype.map.call(megaPixel, async (size): Promise<string> => {
      const image = await ImageService.resize(file, {
        megaPixel: size,
        quality: 0.9,
      });
      const base64 = (await FileService.toBase64(image)) as string;

      return base64.substring(base64.indexOf(",") + 1);
    })
  )) as Array<string>;

  return {
    ...(({ name, type, lastModified }) => ({ name, type, lastModified }))(file),
    data,
    extension: FileService.type(file.name) || "png",
  };
}
