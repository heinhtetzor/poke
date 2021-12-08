const PokeWrapper = require("../src/classes/poke-wrapper");
const Utils = require("../src/utils/utils");

describe ("Utility functions", () => {
	test ("transform encounter details api response into simple location object", async () => {
		const pokeWrapper = new PokeWrapper({ query: "snorlax" });
		await pokeWrapper.init();

		const locationObject = Utils.getEncountersByLocation(pokeWrapper.encounterResponse, "kanto");
		const result =   {
			'kanto-route-12-area': [ 'pokeflute' ],
			'kanto-route-11-area': [ 'pokeflute' ],
			'kanto-route-16-area': [ 'pokeflute' ]
		}
		expect(locationObject).toEqual(result);
	});

	test ("return empty object if kanto encounter location is not found", async () => {
		const pokeWrapper = new PokeWrapper({ query: "dragonite" });
		await pokeWrapper.init();
		
		const locationObject = Utils.getEncountersByLocation(pokeWrapper.encounterResponse, "kanto");
		const result = {};
		expect(locationObject).toEqual(result);
	});
	
	test ("transform types api response into simple object", async () => {
		const pokeWrapper = new PokeWrapper({ query: "456" });
		await pokeWrapper.init();
				
		const typeObject = Utils.getTypes(pokeWrapper.pokemonResponse.types);
		const result = ['water'];
		expect(typeObject).toEqual(result);

	});

	test ("transform stats api response into simple object", async () => {
		const pokeWrapper = new PokeWrapper({ query: "dragonite" });
		await pokeWrapper.init();

		const statObject = Utils.getStats(pokeWrapper.pokemonResponse.stats);		
		const result = {
			hp: 91,
			attack: 134,
			defense: 95,
			'special-attack': 100,
			'special-defense': 100,
			speed: 80
		  }
		  expect(statObject).toEqual(result);
	});
})