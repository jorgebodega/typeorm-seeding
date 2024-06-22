import { Seeder } from "../../src";
import { UserFactory } from "./User.factory";

export default class UserSeeder extends Seeder {
	async run() {
		await new UserFactory().create();
	}
}
