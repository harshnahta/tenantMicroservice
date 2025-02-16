import { randomBytes, createCipheriv, createDecipheriv, scrypt } from 'crypto';
import moment from 'moment-timezone';
import { DEFAULT_SORT_BY } from '@common/constants/global.constants';
const algorithm = 'aes-256-cbc'; // AES algorithm with 256-bit key in CBC mode
const key = randomBytes(32); // Generate a random 256-bit key
const iv = randomBytes(16); // Generate a random 128-bit initialization vector (IV)

const hash = (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(8).toString('hex');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};

const verify = (password, hash) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  });
};

export const AuthHelpers = {
  hash,
  verify,
};

export const encrypt = (data) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  return encrypted.toString('hex');
};

export const decrypt = (encryptedData: string) => {
  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv.toString('hex'), 'hex'),
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
};

export const isJSON = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
};

export const formatDate = (
  date?: string | Date,
  type?: string,
  iso?: boolean,
) => {
  if (!date) date = new Date();
  if (iso) return moment(date).tz('Asia/Kolkata').toISOString(); // Convert date to ISO format
  const formattedDate = moment(date)
    .tz('Asia/Kolkata')
    .format(type || 'DD/MM/YYYY hh:mm:ss a'); // Set timezone offset to +10:00 (Asia/Kolkata) and format date
  return formattedDate;
};
export const getDiffMinute = (otpTime: Date) => {
  const currentTime = moment(new Date());
  const startTime = moment(otpTime);
  return currentTime.diff(startTime, 'minutes');
};

export const sortByOrder = (sortBy?: string) => {
  if (sortBy) {
    const sortField = sortBy.split('_')[0];
    const sortOrder = sortBy.split('_')[1];
    return { sortField, sortOrder: sortOrder };
  } else {
    return { sortField: DEFAULT_SORT_BY, sortOrder: 'asc' };
  }
};

export const searchingAllFields = (
  searchFields: string[],
  searchString: string,
) => {
  return {
    OR: searchFields.map((field) => ({
      [field]: {
        contains: searchString,
        mode: 'insensitive',
      },
    })),
  };
};
export const dateDiff = (date1, date2, type) => {
  date1 = moment(date1 || new Date());
  date2 = moment(date2 || new Date());
  return date1.diff(date2, type);
};
