import { envConfig } from '@common/configs/env.config';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  async imageUpload(
    file: any,
    filePath: string,
    resize = false,
    fixFileName = '',
  ) {
    try {
      // const originalname = file.originalname;
      let bufferData = file.buffer;
      if (resize) {
        bufferData = await this.imageResize(bufferData);
      }
      return bufferData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async imageResize(buffer) {
    try {
      const transformer = sharp(buffer)
        .resize(200)
        .toFormat('webp')
        .toBuffer((err) => {
          if (err) console.log('create buffer error', err);
        });
      return transformer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
