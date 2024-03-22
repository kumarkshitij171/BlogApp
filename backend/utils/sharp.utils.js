const sharp = require('sharp');
const fs = require('fs').promises;

const SharpFunction = async (imageName) => {
  try {
    // Read the input image asynchronously
    const inputImg = await fs.readFile(imageName);

    // Resize the image and write the output asynchronously
    const outputBuffer = await sharp(inputImg)
      .resize(200, 200, {
        kernel: sharp.kernel.nearest,
        fit: 'fill',
        position: 'centre',
      })
      .toBuffer();

    // Write the resized image to the output file
    await fs.writeFile(`${__dirname}/../${imageName}`, outputBuffer);
    // console.log("Image compressed successfully");
  } catch (error) {
    console.error('Error resizing image:', error);
  }
};

module.exports = SharpFunction;