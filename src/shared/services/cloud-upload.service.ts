// @ts-ignore
import { httpService } from "./http.service";
import ImageService from "./image.service";

export async function cloudUpload(files: FileList, type: string): Promise<any> {
  return await Promise.all(
    Array.prototype.map.call(files, async (file) => {
      try {
        const FORM_DATA = new FormData();
        switch (type) {
          case "image":
            const data = await ImageService.resize(file, {
              megaPixel: 2,
              quality: 0.9,
              type: "image/jpeg",
            });

            FORM_DATA.append(type, data || file);
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
}
