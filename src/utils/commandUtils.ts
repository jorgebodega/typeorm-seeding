import type { DataSource } from "typeorm";
import { importClassesFromDirectories } from "typeorm/util/DirectoryExportedClassesLoader";
import { CommandUtils as TypeormCommandUtils } from "typeorm/commands/CommandUtils";
import { Seeder } from "../seeder";
import type { Constructable } from "../types";

export async function loadDataSource(dataSourceFilePath: string): Promise<DataSource> {
	return TypeormCommandUtils.loadDataSource(dataSourceFilePath);
}

export async function loadSeeders(dataSource: DataSource, seederPaths: string[]): Promise<Constructable<Seeder>[]> {
	const seederFileExports = await importClassesFromDirectories(dataSource.logger, seederPaths);

	const seeders = seederFileExports.filter((seeder) => seeder.prototype instanceof Seeder) as Constructable<Seeder>[];

	if (seeders.length === 0) {
		throw new Error("No default seeders found");
	}

	return seeders;
}
