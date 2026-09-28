import { useDataSource, useSeeders } from "../../src";
import { dataSource } from "../fixtures/dataSource";
import { Pet } from "../fixtures/Pet.entity";
import PetSeeder from "../fixtures/Pet.seeder";
import { User } from "../fixtures/User.entity";
import UserSeeder from "../fixtures/User.seeder";

describe(useSeeders, () => {
	beforeAll(async () => {
		await useDataSource(dataSource, true);
	});

	beforeEach(async () => {
		await dataSource.synchronize(true);
	});

	afterAll(async () => {
		await dataSource.destroy();
	});

	test("Should seed with only one seeder provided", async () => {
		await useSeeders(UserSeeder);

		expect(await dataSource.manager.count(User)).toBe(1);
	});

	test("Should seed with multiple seeders provided", async () => {
		await useSeeders([UserSeeder, PetSeeder]);

		expect(await dataSource.manager.count(User)).toBe(2);
		expect(await dataSource.manager.count(Pet)).toBe(1);
	});
});
