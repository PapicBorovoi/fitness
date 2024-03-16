import { registerAs } from '@nestjs/config';
import Joi = require('joi');

const DEFAULT_PORT = 3000;

export interface AppConfig {
  port: number;
  host: string;
  db: {
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    accessTokenSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: string;
  };
}

const validationSchema = Joi.object({
  port: Joi.number().port().required(),
  host: Joi.string().required(),
  db: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
  jwt: Joi.object({
    accessTokenSecret: Joi.string().required(),
    accessTokenExpiresIn: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    refreshTokenExpiresIn: Joi.string().required(),
  }),
});

const validateConfig = (config: AppConfig) => {
  const error = validationSchema.validate(config).error;
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
};

const getConfig = (): AppConfig => {
  const config: AppConfig = {
    port: parseInt(process.env.PORT, 10) || DEFAULT_PORT,
    host: process.env.HOST,
    db: {
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_DB,
    },
    jwt: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
  };

  validateConfig(config);

  return config;
};

export default registerAs('app', getConfig);
