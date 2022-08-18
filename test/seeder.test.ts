import { Seeder, useDataSource } from '../src'
import { User } from './fixtures/User.entity'
import UserSeeder from './fixtures/User.seeder'
import { dataSource } from './fixtures/dataSource'

describe(Seeder, () => {
  beforeAll(async () => {
    await useDataSource(dataSource, { synchronize: true }, true)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe('run', () => {
    test('Should seed users', async () => {
      await new UserSeeder().run()

      const em = dataSource.createEntityManager()
      const [totalUsers] = await Promise.all([em.count(User)])

      expect(totalUsers).toBe(1)
    })
  })
})
