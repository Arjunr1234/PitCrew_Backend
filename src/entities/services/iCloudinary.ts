
export interface ICloudinaryService {
  uploadImage(fileBuffer: Buffer, folderName: string): Promise<string>;
}
