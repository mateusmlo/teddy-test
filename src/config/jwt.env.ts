import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtEnvs = (): JwtModuleOptions => {
  return {
    secret: process.env.ACCESS_TOKEN_SECRET,
    signOptions: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      issuer: 'ALTIMIT Corp.',
    },
  };
};
