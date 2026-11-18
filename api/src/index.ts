import {LoggingBindings} from '@loopback/logging';
import {ApiApplication, ApplicationConfig} from './application';
import {autoMigrateEnabled, checkStartupConfig, corsOrigins} from './config';
import {seedDatabase} from './seed';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const warnings = checkStartupConfig();

  const app = new ApiApplication(options);
  await app.boot();

  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);
  warnings.forEach(warning => logger.warn(warning));

  if (autoMigrateEnabled()) {
    await app.migrateDataSources();
    await seedDatabase(app);
  }

  await app.start();

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
      // On stop, give keep-alive connections 5 s to finish, then force-close
      gracePeriodForClose: 5000,
      // Auth uses a bearer header, not cookies, so credentials stay off
      cors: {origin: corsOrigins(), credentials: false},
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
