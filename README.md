<p align="center">
  <img src="./logo.png" alt="logo" width="160" />
</p>
<h1 align="center" style="text-align: center;">TypeORM Seeding</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/npm/l/@jorgebodega/typeorm-seeding?style=for-the-badge">
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=for-the-badge" alt="Semantic release" />
  </a>
  <a href="https://biomejs.dev/">
    <img src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=for-the-badge&logo=biome" alt="Biome" />
  </a>
  <a href='https://coveralls.io/github/jorgebodega/typeorm-seeding'>
    <img alt="Coveralls main branch" src="https://img.shields.io/coveralls/github/jorgebodega/typeorm-seeding/main?style=for-the-badge">
  </a>
</p>

<p align="center">
  <b>A delightful way to seed test data into your database.</b></br>
  <span>Inspired by the awesome framework <a href="https://laravel.com/">laravel</a> in PHP, <a href="https://mikro-orm.io/docs/next/seeding/">MikroORM seeding</a>  and the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/hirsch88">Gery Hirschfeld</a>, <a href="https://github.com/jorgebodega">Jorge Bodega</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

# Contents

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Introduction](#introduction)
- [Seeder](#seeder-1)
  - [run](#run)
- [CLI](#cli-configuration)
  - [seed](#seed)
- [Testing features](#testing-features)
- [Factory](#factory)
- [Development](#development)

# Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that, install the extension. Add development flag if you are not using seeders nor factories in production code.

```bash
npm i [-D] @jorgebodega/typeorm-seeding
yarn add [-D] @jorgebodega/typeorm-seeding
pnpm add [-D] @jorgebodega/typeorm-seeding
```

# Compatibility

| Version | TypeORM   | Node.js                                 | Branch | Status                                                                        |
| ------- | --------- | --------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| 8.x     | `^0.3.28` | `^20.19.0 \|\| ^22.12.0 \|\| >=24.11.0` | `main` | Stable. Last major supporting TypeORM 0.3; moves to `8.x` for security fixes. |
| 9.x     | `^1.0.0`  | `^20.19.0 \|\| ^22.13.0 \|\| >=24.11.0` | `next` | In development, published with the `next` npm tag.                            |

Node.js ranges follow the ones supported by TypeORM.

# Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a entity factory and/or seed script.

### Entity

```typescript
@Entity()
class User {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column()
  name!: string

  @Column()
  lastName!: string

  @Column()
  email!: string

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets?: Pet[]

  @ManyToOne(() => Country, (country) => country.users, { nullable: false })
  @JoinColumn()
  country!: Country
}
```

### Seeder

```typescript
class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const users: User[] = [...]
    await dataSource.createEntityManager().save<User>(users)
  }
}
```

# Seeder

Seeder class is how we provide a way to insert data into databases, and could be executed by the command line or by helper method. Is an abstract class with one method to be implemented, and a helper function to run some more seeder sequentially.

```typescript
class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    ...
  }
}
```

The seeder class must be exported from its file (default or named export) to be found by the CLI.

```typescript
export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    ...
  }
}
```

## `run`

This function is the one that needs to be defined when extending the class.

```typescript
run(dataSource: DataSource): Promise<void>
```

```typescript
async run(dataSource: DataSource) {
    const users: User[] = [...]
    await dataSource.createEntityManager().save<User>(users)
}
```

# CLI Configuration

There is a command that allows you to execute multiple seeders from cli.

```bash
typeorm-seeding seed -d path/to/datasource src/seeders/*.ts
```

Add the following script to your `package.json` file to configure them.

```json
"scripts": {
  "seed:run": "typeorm-seeding seed -d path/to/datasource",
  ...
}
```

## `seed`

This command executes the seeders found in the given paths. Glob patterns are supported.

```bash
typeorm-seeding seed -d <dataSourcePath> <paths...>
```

Every exported class extending Seeder in the matched files is executed.

##### Options

| Option                 | Default           | Description             |
| ---------------------- | ----------------- | ----------------------- |
| `--dataSource` or `-d` | `./datasource.ts` | Path of the data source |

# Testing features

We provide some testing features that we already use to test this package, like connection configuration.
Use `useDataSource` to register a data source and `useSeeders` to run seeders from your tests.

## `useSeeders`

Execute one or more seeders.

```typescript
useSeeders(entrySeeders: Constructable<Seeder> | Constructable<Seeder>[]): Promise<void>
```

## `useDataSource`

Register the data source used by `useSeeders`. If the data source is not initialized when provided, can be initialized with the `forceInitialization` flag.

```typescript
useDataSource(dataSource: DataSource): Promise<void>
useDataSource(dataSource: DataSource, overrideOptions: Partial<DataSourceOptions>): Promise<void>
useDataSource(dataSource: DataSource, forceInitialization: boolean): Promise<void>
useDataSource(
  dataSource: DataSource,
  overrideOptions: Partial<DataSourceOptions>,
  forceInitialization: boolean,
): Promise<void>
```

# Factory

Factory related code has been removed from this package, now on [@jorgebodega/typeorm-factory](https://github.com/jorgebodega/typeorm-factory).

# Development

Use the Node.js version in `.node-version` and pnpm (`corepack enable`).

```bash
pnpm install
pnpm checks     # format, lint (including import order) and typecheck
pnpm lint:fix   # apply safe lint fixes and sort imports
pnpm test       # jest against in-memory sqlite
pnpm build
```

- `next`: development branch. Releases prereleases with the `next` npm tag.
- `main`: stable releases with the `latest` npm tag.
- `N.x`: maintenance branch of a previous major. Security fixes only, released with the `release-N.x` npm tag.

Commits follow [Conventional Commits](https://www.conventionalcommits.org). Releases are created by the manual **Release** workflow (semantic-release); run it with `dry-run` first.
