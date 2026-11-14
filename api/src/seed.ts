import {LoggingBindings} from '@loopback/logging';
import {ApiApplication} from './application';
import {SeedService} from './services';

export async function seedDatabase(app: ApiApplication) {
  const logger = await app.get(LoggingBindings.WINSTON_LOGGER);
  const seedService = await app.get<SeedService>('services.SeedService');

  logger.info('Seeding sample data into empty tables');
  await seedService.createLocation();
  await seedService.createEvent();
  await seedService.createRoom();
  await seedService.createTalk();
  await seedService.createOrganization();
  await seedService.createPerson();
  await seedService.createTopic();
  await seedService.createParent();
  await seedService.createChildren();
}

if (require.main === module) {
  (async () => {
    const app = new ApiApplication();
    await app.boot();
    await seedDatabase(app);
    await app.stop();
    process.exit(0);
  })().catch(err => {
    console.error('Cannot seed the database', err);
    process.exit(1);
  });
}
