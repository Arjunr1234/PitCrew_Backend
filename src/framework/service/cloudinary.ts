import cloudinary from '../config/cloudinary';
import { ICloudinaryService } from '../../entities/services/iCloudinary'; // Ensure this path is correct
import streamifier from 'streamifier';

class CloudinaryService implements ICloudinaryService {
  
  constructor() {}

  async uploadImage(fileBuffer: Buffer, folderName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error) {
            return reject(new Error('Failed to upload image: ' + error.message));
          }
          if (!result || !result.secure_url) {
            return reject(new Error('Upload succeeded but no URL returned.'));
          }
          resolve(result.secure_url); 
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}

export default CloudinaryService;
