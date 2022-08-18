import type { DataSource } from 'typeorm'
import { CommandUtils as TypeormCommandUtils } from 'typeorm/commands/CommandUtils'
import { Seeder } from '../seeder'
import { Constructable } from '../types'

export class CommandUtils {
  static async loadDataSource(dataSourceFilePath: string): Promise<DataSource> {
    return TypeormCommandUtils.loadDataSource(dataSourceFilePath)
  }

  static async loadSeeders(seederPaths: string[]): Promise<Constructable<Seeder>[]> {
    const seederFileExports = await Promise.all(seederPaths.map((seederFile) => import(seederFile))).then(
      (seederExports) => {
        return seederExports.map((seederExport) => seederExport.default).filter((seederExport) => Boolean(seederExport))
      },
    )

    if (seederFileExports.length === 0) {
      throw new Error(`No default seeders found`)
    }

    const seeders: Constructable<Seeder>[] = []
    for (const fileExport in seederFileExports) {
      const seederExport = seederFileExports[fileExport]
      const instance = new seederExport()
      if (instance instanceof Seeder) {
        seeders.push(seederExport)
      }
    }

    return seeders
  }
}
