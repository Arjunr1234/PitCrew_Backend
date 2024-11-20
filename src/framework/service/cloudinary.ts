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


  extractPublicId(url: string): string {
    const parts = url.split('/');
    
    // Find the index of the version string (starts with 'v')
    const versionIndex = parts.findIndex((part: string) => part.startsWith('v'));
    
    if (versionIndex === -1 || versionIndex + 1 >= parts.length) {
      throw new Error('Invalid Cloudinary URL. Cannot extract public_id.');
    }
  
    // Get the public ID with extension
    const publicIdWithExtension = parts.slice(versionIndex + 1).join('/');
  
    // Remove the extension from the public ID
    return publicIdWithExtension.split('.').slice(0, -1).join('.');
  }
  

  async deleteImage(imageUrl: string): Promise<{ success?: boolean; message?: string }> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      console.log("This is imageUrl: ", imageUrl)
      console.log("This is publicID: ", publicId)
      if (!publicId) {
        throw new Error('Invalid image URL. Cannot extract public_id.');
      }
  
      const result = await cloudinary.uploader.destroy(publicId);
  
      if (result.result === 'ok') {
        console.log('Image deleted successfully');
        return { success: true, message: 'Image deleted successfully' };
      } else {
        console.warn('Image not found or already deleted:', result.result);
        return { success: false, message: 'Image not found or already deleted' };
      }
    } catch (error: any) {
      console.error('Delete Image Error:', error);
      return { success: false, message: `Failed to delete image: ${error.message}` };
    }
  }
  
}

export default CloudinaryService;
