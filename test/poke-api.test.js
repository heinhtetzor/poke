const PokeWrapper = require("../src/classes/poke-wrapper");

describe("PokeApiWrapper", () => {
	test ('return pokemon from poke api', async () => {
		const pokeWrapper = new PokeWrapper({query: "pikachu"});
		await pokeWrapper.getPokemon();	
		expect(pokeWrapper.pokemonResponse.id).toEqual(25);	
	})
	
	test ('return encounter details from poke api', async () => {
		const pokeWrapper = new PokeWrapper({query: "pikachu"});
		await pokeWrapper.getPokemon();	
		await pokeWrapper.getEncounters();	
		expect(pokeWrapper.encounterResponse[0].location_area.name).toEqual('trophy-garden-area');
	})
	
	test ('same return value from id search and name search for same pokemon', async () => {
		const pokeWrapper1 = new PokeWrapper({query: "pikachu"});
		const pokeWrapper2 = new PokeWrapper({query: 25});
	
		await pokeWrapper1.getPokemon();
		await pokeWrapper2.getPokemon();
	
		expect(pokeWrapper1.pokemonResponse.id).toEqual(pokeWrapper2.pokemonResponse.id);
	})
});
