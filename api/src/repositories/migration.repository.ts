import {DefaultTransactionalRepository} from '@loopback/repository';
import {Migration, MigrationRelations} from '../helper';
import {inject} from '@loopback/core';
import {ConferenceDatasource} from '../datasources';

export class MigrationRepository extends DefaultTransactionalRepository<
  Migration,
  typeof Migration.prototype.id,
  MigrationRelations
> {
  constructor(@inject('datasources.conference') dataSource: ConferenceDatasource) {
    super(Migration, dataSource);
  }
}
