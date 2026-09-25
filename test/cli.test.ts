import { DataSource } from "typeorm";
import { SeederImportationError } from "../src";
import { bootstrap } from "../src/commands/seed.command";
import { DataSourceImportationError } from "../src/errors/DataSourceImportationError";
import { SeederExecutionError } from "../src/errors/SeederExecutionError";
import { dataSource } from "./fixtures/dataSource";
import PetSeeder from "./fixtures/Pet.seeder";
import UserSeeder from "./fixtures/User.seeder";

const cli = (...argv: string[]) => bootstrap(["ts-node", "src/cli.ts", ...argv]);

describe("Seed command", () => {
	const userRunFn = jest.spyOn(UserSeeder.prototype, "run");

	test("Should fail without valid data source", async () => {
		await expect(cli("-d", "./invalidDataSource.ts", "")).rejects.toThrow(DataSourceImportationError);
	});

	test("Should fail with invalid seeders", async () => {
		await expect(cli("-d", "./test/fixtures/dataSource.ts", "./invalidSeeder.ts")).rejects.toThrow(
			SeederImportationError,
		);
	});

	test.each([
		["the seeder fails", () => userRunFn.mockRejectedValueOnce(new Error())],
		[
			"the data source cannot be initialized",
			() => jest.spyOn(DataSource.prototype, "initialize").mockRejectedValueOnce(new Error()),
		],
	])("Should fail with seeder execution error when %s", async (_, arrange) => {
		arrange();

		await expect(cli("-d", "./test/fixtures/dataSource.ts", "./test/fixtures/User.seeder.ts")).rejects.toThrow(
			SeederExecutionError,
		);
	});

	describe("Should execute seeders", () => {
		const petRunFn = jest.spyOn(PetSeeder.prototype, "run");

		beforeAll(async () => {
			await dataSource.initialize();
		});

		beforeEach(async () => {
			await dataSource.synchronize(true);

			userRunFn.mockReset();
			petRunFn.mockReset();
		});

		afterEach(async () => {
			await dataSource.initialize();
		});

		afterAll(async () => {
			await dataSource.destroy();
		});

		test("Should seed with only one seeder provided", async () => {
			await cli("-d", "./test/fixtures/dataSource.ts", "./test/fixtures/User.seeder.ts");

			expect(userRunFn).toHaveBeenCalledTimes(1);
		});

		test("Should seed with multiple seeders provided", async () => {
			await cli("-d", "./test/fixtures/dataSource.ts", "./test/fixtures/*.seeder.ts");

			expect(userRunFn).toHaveBeenCalledTimes(1);
			expect(petRunFn).toHaveBeenCalledTimes(1);
		});
	});
});
