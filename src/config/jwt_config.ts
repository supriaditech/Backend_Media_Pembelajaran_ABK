export const jwt_config = {
  secret: process.env.JWT_SECRET,
  expired: 30 * 24 * 60 * 60,
};
