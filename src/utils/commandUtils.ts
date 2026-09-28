import type { DataSource } from "typeorm";
import { CommandUtils as TypeormCommandUtils } from "typeorm/commands/CommandUtils";
import { importClassesFromDirectories } from "typeorm/util/DirectoryExportedClassesLoader";
import { Seeder } from "../seeder";
import type { Constructable } from "../types";

export async function loadDataSource(dataSourceFilePath: string): Promise<DataSource> {
	return TypeormCommandUtils.loadDataSource(dataSourceFilePath);
}

export async function loadSeeders(dataSource: DataSource, seederPaths: string[]): Promise<Constructable<Seeder>[]> {
	const seederFileExports = await importClassesFromDirectories(dataSource.logger, seederPaths);

	const seeders = [...new Set(seederFileExports)].filter(
		(seeder) => seeder.prototype instanceof Seeder && typeof seeder.prototype.run === "function",
	) as Constructable<Seeder>[];

	if (seeders.length === 0) {
		throw new Error("No seeders found");
	}

	return seeders;
}
