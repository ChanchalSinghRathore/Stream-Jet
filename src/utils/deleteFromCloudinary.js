import { v2 as cloudinary } from 'cloudinary';

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract the public_id from the Cloudinary URL
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const fileName = parts.pop(); // e.g. avatar_xxx123.jpg
    const folder = parts.slice(2).join('/'); // remove the first 2 segments: '', 'image', 'upload'

    const publicId = `${folder}/${fileName.split('.')[0]}`; // remove .jpg/.png

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", result);
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err.message);
  }
};
