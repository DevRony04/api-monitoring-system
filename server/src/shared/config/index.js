// write here global level config.

import dotenv from "dotenv";

dotenv.config();

// helper
const requireEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return process.env[key];
};

const config = {
  // Server
  node_env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),

  // MongoDB
  mongo: {
    uri: requireEnv("MONGO_URI"),
    dbName: process.env.MONGO_DB_NAME || "api_monitoring",
  },

  // PostgreSQL
  postgres: {
    host: requireEnv("PG_HOST"),
    port: parseInt(process.env.PG_PORT || "5432", 10),
    database: requireEnv("PG_DATABASE"),
    user: requireEnv("PG_USER"),
    password: requireEnv("PG_PASSWORD"),
  },

  // RabbitMQ
  rabbitmq: {
    url: requireEnv("RABBITMQ_URL"),
    queue: process.env.RABBITMQ_QUEUE || "api_hits",
    publisherConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS === "true",
    retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || "3", 10),
    retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || "1000", 10),
  },

  // JWT
  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // Rate Limit
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  // Cookie
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expiresIn: 24 * 60 * 60 * 1000,
  },
};

export default config;