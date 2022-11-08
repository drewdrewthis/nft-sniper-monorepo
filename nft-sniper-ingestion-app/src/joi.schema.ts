import * as Joi from 'joi';

const obj = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  X2Y2_SCHEDULER_FREQUENCY_MS: Joi.number().required(),
  // OPENSEA_SCRAPER_SCHEDULER_FREQUENCY_MS: Joi.number().required(),
};

export const schema = Joi.object(obj).unknown(true);
