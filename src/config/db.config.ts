export const dbConfig = () => {
  return {
    dbPassword: process.env.MYSQL_ROOT_PASSWORD,
    db: process.env.MYSQL_DATABASE,
    dbPort: process.env.MYSQL_TCP_PORT,
    dbHost: process.env.MYSQL_HOST,
    dbUser: process.env.MYSQL_USER,
  };
};
