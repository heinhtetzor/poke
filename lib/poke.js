#!/usr/bin/env node
const Cacheable = require('./classes/cacheable');
const PokeWrapper = require('./classes/poke-wrapper');
const Pokemon = require('./classes/pokemon');
const Utils = require('./utils');
const ConsoleWriter = require('./classes/console-writer');
const Config = require('./config/Config');
const { resolve } = require('path');


async function main () {
	const param = process.argv.slice(2)[0];

	if (param === '--help' || param === '-h') {
		let helpString = "Hello! This is a simple pokemon api wrapper.\n\n";
		helpString += "Usage: poke [options]\n\n";
		ConsoleWriter.outWithColor(ConsoleWriter.COLORS.FgGreen, helpString);
		return;
	}
	
	const cache =  new Cacheable({
		fileName: resolve(__dirname, '../cache.txt'),
		ttl: 60 * 60 * 24 * 7 * 1000
	});
	const config = new Config();

	let pokemon;
	let query = param.toLowerCase();

	if (cache.has(query)) {
		const cachedPokemon = cache.get(query);

		pokemon = new Pokemon({
			id: cachedPokemon.id,
			name: cachedPokemon.name,
			locations: cachedPokemon.locations,
			types: cachedPokemon.types,
			stats: cachedPokemon.stats,
		});

	} else {

		const pokeApiWrapper = new PokeWrapper({
			query
		});
		await pokeApiWrapper.init();
	
		const locations = Utils.getEncountersByLocation(pokeApiWrapper.encounterResponse, config.fixedPokemonLocation);
		const types = Utils.getTypes(pokeApiWrapper.pokemonResponse.types);
		const stats = Utils.getStats(pokeApiWrapper.pokemonResponse.stats);
	
		pokemon = new Pokemon({
			id: pokeApiWrapper.pokemonResponse.id,
			name: pokeApiWrapper.pokemonResponse.name,
			locations,
			types,
			stats
		});
		cache.set(pokemon.id, pokemon);
		cache.set(pokemon.name, pokemon);			
	}
	
	ConsoleWriter.outWithColor(ConsoleWriter.COLORS.FgYellow, pokemon.toString());

}

main ();

