const config = {
  jwt: {
    ACCESS_TOKEN_COOKIE_KEY: 'alpha_sniper_access_token',
    ACCESS_TOKEN_EXPIRATION_COOKIE_KEY: 'alpha_sniper_access_token_expiration',
  },
  endpoints: {
    X2Y2_API: 'https://api.x2y2.org/v1',
  },
};

// This is dumb but it works
export type Configuration = typeof config &
  typeof config.jwt &
  typeof config.endpoints;

export default () => config;
