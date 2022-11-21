import * as Joi from 'joi';

const obj = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  X2Y2_SCHEDULER_FREQUENCY_MS: Joi.number().required(),
  MAX_TRACKABLE_TOKEN_COUNT: Joi.number().default(3),
  // OPENSEA_SCRAPER_SCHEDULER_FREQUENCY_MS: Joi.number().required(),
};

export const schema = Joi.object(obj).unknown(true);
