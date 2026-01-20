import { DataSource } from "typeorm";

export const dataSource = new DataSource({
	type: "better-sqlite3",
	database: ":memory:",
	entities: ["test/fixtures/**/*.entity.ts"],
});
