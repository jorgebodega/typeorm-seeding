import { resolve } from 'node:path'
import { Command } from 'commander'
import ora from 'ora'
import { DataSource } from 'typeorm'
import { SeederImportationError } from '../errors'
import { DataSourceImportationError } from '../errors/DataSourceImportationError'
import { SeederExecutionError } from '../errors/SeederExecutionError'
import { useDataSource, useSeeders } from '../helpers'
import { Seeder } from '../seeder'
import { Constructable, SeedCommandArguments } from '../types'
import { calculateFilePath, CommandUtils } from '../utils'

async function run(path: string) {
  const opts = seedCommand.opts<SeedCommandArguments>()
  const spinner = ora({ isSilent: process.env.NODE_ENV === 'test' }).start()

  spinner.start('Loading datasource')
  let dataSource!: DataSource
  try {
    const dataSourcePath = resolve(process.cwd(), opts.dataSource)

    dataSource = await CommandUtils.loadDataSource(dataSourcePath)

    spinner.succeed('Datasource loaded')
  } catch (error: any) {
    spinner.fail('Could not load the data source!')
    throw new DataSourceImportationError('Could not load the data source!', { cause: error })
  }

  spinner.start('Importing seeders')
  let seeders!: Constructable<Seeder>[]
  try {
    const seederFiles = calculateFilePath(path)

    seeders = await CommandUtils.loadSeeders(seederFiles)

    spinner.succeed('Seeder imported')
  } catch (error: any) {
    spinner.fail('Could not load seeders!')
    throw new SeederImportationError('Could not load seeders!', { cause: error })
  }

  spinner.info(`Executing seeders...`)
  try {
    await useDataSource(dataSource, true)

    for (const seeder of seeders) {
      spinner.start(`Executing ${seeder.name}`)
      await useSeeders(seeder)
      spinner.succeed(`Seeder ${seeder.name} executed`)
    }
  } catch (error: any) {
    spinner.fail('Could not execute seeder!')
    await dataSource.destroy()
    throw new SeederExecutionError('Could not execute seeder!', { cause: error })
  }

  spinner.succeed('Finished seeding')
  await dataSource.destroy()
}

const seedCommand = new Command('seed')
  .description('Run the seeders specified by the path. Glob pattern is allowed.')
  .requiredOption(
    '-d, --dataSource <dataSourcePath>',
    'Path to the file where your DataSource instance is defined.',
    './datasource.ts',
  )
  .argument('<path>', 'Path to the seeders. Glob pattern is allowed.')
  .action(run)

export async function bootstrap(argv: string[]) {
  await seedCommand.parseAsync(argv)
}
