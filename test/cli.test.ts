import { SeederImportationError } from '../src'
import { bootstrap } from '../src/commands/seed.command'
import { DataSourceImportationError } from '../src/errors/DataSourceImportationError'
import { SeederExecutionError } from '../src/errors/SeederExecutionError'
import PetSeeder from './fixtures/Pet.seeder'
import UserSeeder from './fixtures/User.seeder'
import { dataSource } from './fixtures/dataSource'

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

    beforeAll(async () => {
      await dataSource.initialize()
    })

    beforeEach(async () => {
      await dataSource.synchronize(true)

      userRunFn.mockReset()
      petRunFn.mockReset()
    })

    afterEach(async () => {
      await dataSource.initialize()
    })

    afterAll(async () => {
      await dataSource.destroy()
    })

    test('Should seed with only one seeder provided', async () => {
      await cli('-d', './test/fixtures/dataSource.ts', './test/fixtures/User.seeder.ts')

      expect(userRunFn).toHaveBeenCalledTimes(1)
    })

    test('Should seed with multiple seeders provided', async () => {
      await cli('-d', './test/fixtures/dataSource.ts', './test/fixtures/*.seeder.ts')

      expect(userRunFn).toHaveBeenCalledTimes(1)
      expect(petRunFn).toHaveBeenCalledTimes(1)
    })
  })
})
