export default class FileService {
  public static type(file: string): string | null {
    const ext = file?.split('.');

    return ext ? ext[ext.length - 1] : null;
  }

  public static async toBlob(base64: string, type: string): Promise<Blob> {
    const blob = atob(base64.split(',')[1]);
    const array = [];

    for (let i = 0; i < blob.length; i++) {
      array.push(blob.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type });
  }

  public static async toFile(base64: string, { name, type, lastModified }: { name: string; type: string; lastModified: number }): Promise<File> {
    const blob = await this.toBlob(base64, type);

    return new File([blob], name, { type, lastModified });
  }

  public static async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject();
    });
  }
}
