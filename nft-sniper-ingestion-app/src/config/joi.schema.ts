import * as Joi from 'typesafe-joi';

const obj = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  MAX_TRACKABLE_TOKEN_COUNT: Joi.number().default(3),
  // With a 0 default, this won't run
  OPENSEA_SCHEDULER_FREQUENCY_MS: Joi.number().default(0),
  X2Y2_SCHEDULER_FREQUENCY_MS: Joi.number().default(0),
  RESEVOIR_API_KEY: Joi.string().required(),
  RESEVOIR_RATE_LIMIT_MAX_RPS: Joi.number().required(),
};

export const schema = Joi.object(obj).unknown(true);

const result = schema.validate(process.env);

if (result.error || !result.value) {
  console.error(result.error);
  throw new Error('ENV Validation failed');
}

export const env = result.value;
