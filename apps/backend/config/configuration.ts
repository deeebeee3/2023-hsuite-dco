export default () => ({
  mongoDB: {
    url: process.env.MONGODB_URI,
    port: parseInt(process.env.MONGODB_PORT, 10) || 27017,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mailer: {
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    fromAddress: process.env.MAILER_FROM_ADDRESS,
    dcoAdminEmail: process.env.MAILER_DCO_ADMIN_EMAIL,
  },
  environment: process.env.NODE_ENV,
});
