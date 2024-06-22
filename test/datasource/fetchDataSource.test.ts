import { DataSource } from "typeorm";
import { DataSourceNotProvidedError, useDataSource } from "../../src";
import { fetchDataSource } from "../../src/datasource";
import { dataSource } from "../fixtures/dataSource";

describe(fetchDataSource, () => {
	test("Should fail if there is no data source", () => {
		expect(() => fetchDataSource()).toThrow(DataSourceNotProvidedError);
	});

	test("Should fetch data source", async () => {
		await useDataSource(dataSource);

		expect(fetchDataSource()).toBeInstanceOf(DataSource);
	});
});
