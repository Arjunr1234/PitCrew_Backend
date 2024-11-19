
export interface ICloudinaryService {
  uploadImage(fileBuffer: Buffer, folderName: string): Promise<string>;
  deleteImage(imageUrl:string):Promise<{success?:boolean, message?:string}>
}
