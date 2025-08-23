// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Attach a Promise-based stream uploader
cloudinary.uploadStreamAsync = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

// Extract public ID from Cloudinary URL
cloudinary.extractPublicId = (url) => {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return matches?.[1] || null;
  } catch {
    return null;
  }
};

// Move a file from its current location to a target folder
cloudinary.moveToFolderByUrl = async (url, targetFolder) => {
  const publicId = cloudinary.extractPublicId(url);
  if (!publicId) throw new Error('Invalid Cloudinary URL');

  const newPublicId = `${targetFolder}/${publicId.split('/').pop()}`;

  await cloudinary.uploader.rename(publicId, newPublicId, {
    overwrite: true,
  });
};

export default cloudinary;