"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
class CloudinaryService {
    constructor() { }
    uploadImage(fileBuffer, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: folderName }, (error, result) => {
                    if (error) {
                        return reject(new Error('Failed to upload image: ' + error.message));
                    }
                    if (!result || !result.secure_url) {
                        return reject(new Error('Upload succeeded but no URL returned.'));
                    }
                    resolve(result.secure_url);
                });
                streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
            });
        });
    }
    extractPublicId(url) {
        const parts = url.split('/');
        // Find the index of the version string (starts with 'v')
        const versionIndex = parts.findIndex((part) => part.startsWith('v'));
        if (versionIndex === -1 || versionIndex + 1 >= parts.length) {
            throw new Error('Invalid Cloudinary URL. Cannot extract public_id.');
        }
        // Get the public ID with extension
        const publicIdWithExtension = parts.slice(versionIndex + 1).join('/');
        // Remove the extension from the public ID
        return publicIdWithExtension.split('.').slice(0, -1).join('.');
    }
    deleteImage(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publicId = this.extractPublicId(imageUrl);
                console.log("This is imageUrl: ", imageUrl);
                console.log("This is publicID: ", publicId);
                if (!publicId) {
                    throw new Error('Invalid image URL. Cannot extract public_id.');
                }
                const result = yield cloudinary_1.default.uploader.destroy(publicId);
                if (result.result === 'ok') {
                    console.log('Image deleted successfully');
                    return { success: true, message: 'Image deleted successfully' };
                }
                else {
                    console.warn('Image not found or already deleted:', result.result);
                    return { success: false, message: 'Image not found or already deleted' };
                }
            }
            catch (error) {
                console.error('Delete Image Error:', error);
                return { success: false, message: `Failed to delete image: ${error.message}` };
            }
        });
    }
}
exports.default = CloudinaryService;
