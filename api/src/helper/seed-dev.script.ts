import {ApiApplication} from '../application';
import {LoggingBindings} from '@loopback/extension-logging';
import {SeedService} from "../services";

async function seedDev() {

    // Boot the application to access bindings
  const app = new ApiApplication();
  await app.boot();

  // Get application services
  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);

    logger.info(`Seeding Application Instance`);
  const seedService = await app.get<SeedService>('services.SeedService');
    logger.info(`Seeding Location data`);
  await seedService.createLocation();
    logger.info(`Seeding Event data`);
  await seedService.createEvent();
    logger.info(`Seeding Room data`);
  await seedService.createRoom();
    logger.info(`Seeding Talk data`);
  await seedService.createTalk();
    logger.info(`Seeding Organization data`);
  await seedService.createOrganization();
    logger.info(`Seeding Person data`);
  await seedService.createPerson();
    logger.info(`Seeding Topic data`);
  await seedService.createTopic();
    logger.info(`Seeding Parent data`);
  await seedService.createParent();
    logger.info(`Seeding Children data`);
  await seedService.createChildren();
}

// Execute script
seedDev().catch((error) => {
    console.error(error);
    console.error(error.meta?.body);
    process.exitCode = 1;
});
