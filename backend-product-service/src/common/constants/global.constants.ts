//eslint-disable-next-line
require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SIGNATURE;
export const JWT_EXPIRY_SECONDS = 3600;

export enum ROLES_ENUM {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export const PASSWORD_CHANGE_EXPIRE = 60;
export const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
};
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT_BY = 'updatedAt';

export const API_PREFIX = '/api/v1';

//Regex
export const PHONE_REGEX = /^[0-9\s+-.()]+$/;

export const SLUG_SEPARATOR = '-';

export const CATEGORY_DEPTH_LIMIT = 3;

export enum EVENT_LOG_MODEL {
  Category = 'Category',
}
export enum EVENT_LOG_TYPE {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
