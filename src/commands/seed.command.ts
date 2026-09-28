import { resolve } from "node:path";
import { Command } from "commander";
import ora from "ora";
import { DataSourceImportationError, SeederExecutionError, SeederImportationError } from "../errors";
import { useDataSource, useSeeders } from "../helpers";
import type { SeedCommandArguments } from "../types";
import { loadDataSource, loadSeeders } from "../utils";

async function run(paths: string[], opts: SeedCommandArguments) {
	// biome-ignore lint/complexity/useLiteralKeys: Conflict with TS
	const spinner = ora({ isSilent: process.env["NODE_ENV"] === "test" });

	spinner.start("Loading datasource");
	const dataSource = await loadDataSource(resolve(process.cwd(), opts.dataSource)).catch((error: unknown) => {
		spinner.fail("Could not load the data source!");
		throw new DataSourceImportationError("Could not load the data source!", { cause: error });
	});
	spinner.succeed("Datasource loaded");

	spinner.start("Importing seeders");
	const seeders = await loadSeeders(dataSource, paths).catch((error: unknown) => {
		spinner.fail("Could not load seeders!");
		throw new SeederImportationError("Could not load seeders!", { cause: error });
	});
	spinner.succeed("Seeder imported");

	spinner.info("Executing seeders...");
	try {
		await useDataSource(dataSource, true);

		for (const seeder of seeders) {
			spinner.start(`Executing ${seeder.name}`);
			await useSeeders(seeder);
			spinner.succeed(`Seeder ${seeder.name} executed`);
		}
	} catch (error: unknown) {
		spinner.fail("Could not execute seeder!");
		if (dataSource.isInitialized) await dataSource.destroy().catch(() => undefined);
		throw new SeederExecutionError("Could not execute seeder!", { cause: error });
	}

	spinner.succeed("Finished seeding");
	await dataSource.destroy();
}

const seedCommand = new Command("seed")
	.description("Run the seeders specified by the path. Glob pattern is allowed.")
	.requiredOption(
		"-d, --dataSource <dataSourcePath>",
		"Path to the file where your DataSource instance is defined.",
		"./datasource.ts",
	)
	.argument("<path...>", "Paths to the seeders. Glob pattern is allowed.")
	.action(run);

export async function bootstrap(argv: string[]) {
	await seedCommand.parseAsync(argv);
}
