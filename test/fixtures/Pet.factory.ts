import { faker } from "@faker-js/faker";
import { type FactorizedAttrs, Factory, LazyInstanceAttribute, SingleSubfactory } from "@jorgebodega/typeorm-factory";
import { Pet } from "./Pet.entity";
import { UserFactory } from "./User.factory";
import { dataSource } from "./dataSource";

export class PetFactory extends Factory<Pet> {
	protected entity = Pet;
	protected dataSource = dataSource;

	protected attrs(): FactorizedAttrs<Pet> {
		return {
			name: faker.animal.insect(),
			owner: new LazyInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pets: [instance] })),
		};
	}
}
