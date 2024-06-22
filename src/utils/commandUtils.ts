import type { DataSource } from "typeorm";
import { CommandUtils as TypeormCommandUtils } from "typeorm/commands/CommandUtils";
import { Seeder } from "../seeder";
import type { Constructable } from "../types";

export async function loadDataSource(dataSourceFilePath: string): Promise<DataSource> {
	return TypeormCommandUtils.loadDataSource(dataSourceFilePath);
}

export async function loadSeeders(seederPaths: string[]): Promise<Constructable<Seeder>[]> {
	const seederFileExports = (await Promise.all(seederPaths.map((seederFile) => import(seederFile))))
		.map((seederExport) => seederExport.default?.default ?? seederExport.default)
		.filter((seederExport) => Boolean(seederExport));

	if (seederFileExports.length === 0) {
		throw new Error("No default seeders found");
	}

	const seeders: Constructable<Seeder>[] = [];
	for (const fileExport in seederFileExports) {
		const seederExport = seederFileExports[fileExport];
		const instance = new seederExport();
		if (instance instanceof Seeder) {
			seeders.push(seederExport);
		}
	}

	return seeders;
}
