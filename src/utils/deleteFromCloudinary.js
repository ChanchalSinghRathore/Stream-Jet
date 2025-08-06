import { v2 as cloudinary } from 'cloudinary'

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return

    // Parse URL and extract path
    const url = new URL(imageUrl)
    const pathnameParts = url.pathname.split('/') // e.g. [ '', 'image', 'upload', 'v1754176625', 'fdr2j5r9fxyz.jpg' ]

    // Get file name from last segment
    const fileWithExt = pathnameParts.pop() // e.g. "fdr2j5r9fxyz.jpg"
    const publicId = fileWithExt.split('.')[0] // e.g. "fdr2j5r9fxyz"

    // ✅ Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

   
    return result
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error.message)
  }
}
