import { faker } from '@faker-js/faker'
import { FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory'
import { User } from '../fixtures/User.entity'
import { dataSource } from './dataSource'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = dataSource

  protected attrs(): FactorizedAttrs<User> {
    return {
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 65 }),
      email: faker.internet.email(),
      pets: [],
    }
  }
}
