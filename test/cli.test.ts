import { SeederImportationError, useDataSource } from '../src'
import { bootstrap } from '../src/commands/seed.command'
import { DataSourceImportationError } from '../src/errors/DataSourceLoadError'
import { SeederExecutionError } from '../src/errors/SeederExecutionError'
import { dataSource } from './fixtures/dataSource'
import { Pet } from './fixtures/Pet.entity'
import PetSeeder from './fixtures/Pet.seeder'
import { User } from './fixtures/User.entity'
import UserSeeder from './fixtures/User.seeder'

const cli = (...argv: string[]) => bootstrap(['ts-node', 'src/cli.ts', ...argv])

describe('Seed command', () => {
  test('Should fail without valid data source', async () => {
    await expect(cli('-d', './invalidDataSource.ts', '')).rejects.toThrow(DataSourceImportationError)
  })

  test('Should fail with invalid seeders', async () => {
    await expect(cli('-d', './test/fixtures/dataSource.ts', './invalidSeeder.ts')).rejects.toThrow(
      SeederImportationError,
    )
  })

  test('Should fail with bad seeder', async () => {
    jest.spyOn(UserSeeder.prototype, 'run').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(cli('-d', './test/fixtures/dataSource.ts', './test/fixtures/User.seeder.ts')).rejects.toThrow(
      SeederExecutionError,
    )
  })

  describe('Should execute seeders', () => {
    const userRunFn = jest.spyOn(UserSeeder.prototype, 'run')
    const petRunFn = jest.spyOn(PetSeeder.prototype, 'run')

    beforeEach(async () => {
      await dataSource.initialize()
      await dataSource.synchronize()

      userRunFn.mockReset()
      petRunFn.mockReset()
    })

    afterEach(async () => {
      await dataSource.initialize()
      await dataSource.dropDatabase()
      await dataSource.destroy()
    })

    test('Should seed with only one seeder provided', async () => {
      const runFn = jest.spyOn(UserSeeder.prototype, 'run')

      await cli('-d', './test/fixtures/dataSource.ts', './test/fixtures/User.seeder.ts')

      expect(runFn).toHaveBeenCalledTimes(1)

      runFn.mockReset()
    })

    test('Should seed with multiple seeders provided', async () => {
      const userRunFn = jest.spyOn(UserSeeder.prototype, 'run')
      const petRunFn = jest.spyOn(PetSeeder.prototype, 'run')

      await cli('-d', './test/fixtures/dataSource.ts', './test/fixtures/*.seeder.ts')

      expect(userRunFn).toHaveBeenCalledTimes(1)
      expect(petRunFn).toHaveBeenCalledTimes(1)

      userRunFn.mockReset()
      petRunFn.mockReset()
    })
  })
})
