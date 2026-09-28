import { existsSync, unlinkSync } from "node:fs";
import { useDataSource } from "../../src";
import { fetchDataSource } from "../../src/datasource";
import { dataSource } from "../fixtures/dataSource";

describe(useDataSource, () => {
	afterAll(async () => {
		if (existsSync("test.sql")) {
			unlinkSync("test.sql");
		}
	});

	test("Should fetch data source", async () => {
		await useDataSource(dataSource);

		expect(fetchDataSource()).toBe(dataSource);
		expect(dataSource.isInitialized).toBeFalsy();
	});

	test("Should fetch data source overriding options", async () => {
		await useDataSource(dataSource, { database: "test.sql" });

		expect(fetchDataSource()).toBe(dataSource);
		expect(dataSource.isInitialized).toBeFalsy();
		expect(dataSource.options).toMatchObject({ database: "test.sql" });
	});

	describe("With initialization flag", () => {
		afterEach(async () => {
			await dataSource.destroy();
		});

		test("Should fetch data source initializing it", async () => {
			await useDataSource(dataSource, true);

			expect(fetchDataSource()).toBe(dataSource);
			expect(dataSource.isInitialized).toBeTruthy();
		});

		test("Should fetch data source overriding options and initializing it", async () => {
			await useDataSource(dataSource, { database: "test.sql" }, true);

			expect(fetchDataSource()).toBe(dataSource);
			expect(dataSource.isInitialized).toBeTruthy();
			expect(dataSource.options).toMatchObject({ database: "test.sql" });
		});
	});
});
