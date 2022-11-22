import * as Joi from 'joi';

const obj = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  MAX_TRACKABLE_TOKEN_COUNT: Joi.number().default(3),
  // With a 0 default, this won't run
  OPENSEA_SCHEDULER_FREQUENCY_MS: Joi.number().default(0),
  X2Y2_SCHEDULER_FREQUENCY_MS: Joi.number().default(0),
};

export const schema = Joi.object(obj).unknown(true);
