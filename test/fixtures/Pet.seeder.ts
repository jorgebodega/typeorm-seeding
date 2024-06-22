import { Seeder } from "../../src";
import { PetFactory } from "./Pet.factory";

export default class PetSeeder extends Seeder {
	async run() {
		await new PetFactory().create();
	}
}
