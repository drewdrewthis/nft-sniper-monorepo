import { env } from '../config/joi.schema';
import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: env.JWT_SECRET_KEY,
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
