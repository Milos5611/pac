import {LoggingBindings} from '@loopback/logging';
import {ApiApplication, ApplicationConfig} from './application';
import {seedDatabase} from './seed';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new ApiApplication(options);
  await app.boot();

  if (process.env.AUTO_MIGRATE !== 'false') {
    await app.migrateDataSources();
    await seedDatabase(app);
  }

  await app.start();

  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);
  const url = app.restServer.url;
  logger.info(`Server is running at ${url}`);
  logger.info(`GraphQL endpoint: ${url}/graphql`);

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      cors: {origin: true, credentials: true},
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
