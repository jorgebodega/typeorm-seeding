import { DataSourceNotProvidedError } from "../../src";
import { fetchDataSource } from "../../src/datasource";

describe(fetchDataSource, () => {
	test("Should fail if there is no data source", () => {
		expect(() => fetchDataSource()).toThrow(DataSourceNotProvidedError);
	});
});
