export const authConfig = {
   accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
   refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
   accessTokenExpiration: process.env.JWT_ACCESS_SECRET_EXPIRATION || '15m',
   refreshTokenExpiration: process.env.JWT_REFRESH_SECRET_EXPIRATION || '1h',
};
