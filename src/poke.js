#!/usr/bin/env node
const { resolve } = require('path');
const Cacheable = require('./classes/cacheable');
const PokeWrapper = require('./classes/poke-wrapper');
const Pokemon = require('./classes/pokemon');
const Utils = require('./utils/utils');
const ConsoleWriter = require('./utils/console-writer');
const Config = require('./config/config');

/**
 * 
 * @description entry point for application
 */
async function main () {
	const param = process.argv.slice(2)[0];

	if (param === undefined) {
		let helpString = "Please provide id or name to search Pokemon.\n\n";
		helpString += " usage: poke query [options]\n";
		helpString += " options: \n";
		helpString += "   -h, --help Help Text\n";
		helpString += " examples: \n";
		helpString += "   poke snorlax\n";
		helpString += "   poke 123\n";
		helpString += "   poke Dragonite\n";
		ConsoleWriter.outWithColor(ConsoleWriter.COLORS.BgRed, helpString);
		return;
	}

	if (param === '--help' || param === '-h') {
		let helpString = "Hello! Welcome to Pokemon Digital Guide.\n\n";
		helpString += " usage: poke query [options]\n";
		helpString += " options: \n";
		helpString += "   -h, --help Help Text\n";
		helpString += " examples: \n";
		helpString += "   poke snorlax\n";
		helpString += "   poke 123\n";
		helpString += "   poke Dragonite\n";
		ConsoleWriter.outWithColor(ConsoleWriter.COLORS.FgBlue, helpString);
		return;
	}
	
	const cache =  new Cacheable({
		fileName: resolve(__dirname, '../cache.txt'),
		ttl: 60 * 60 * 24 * 7 * 1000
	});
	const config = new Config();

	let pokemon; //to dynamically set pokemon instance based on cache hit or cache miss
	let query = param.toLowerCase();

	if (cache.has(query)) { //cache hit
		const cachedPokemon = cache.get(query);

		//create pokemon instance based on cached data
		pokemon = new Pokemon({
			id: cachedPokemon.id,
			name: cachedPokemon.name,
			locations: cachedPokemon.locations,
			types: cachedPokemon.types,
			stats: cachedPokemon.stats,
		});

	} else { //cache miss

		//create pokemon wrapper instance to call api
		const pokeApiWrapper = new PokeWrapper({
			query
		});

		//init will call required two subsequent api calls
		await pokeApiWrapper.init();
	
		//construct simplified pokemon object from raw response
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
		
		//set cache with both id and name key for furthur query for same pokemon
		cache.set(pokemon.id, pokemon);
		cache.set(pokemon.name, pokemon);			
	}
	
	ConsoleWriter.outWithColor(ConsoleWriter.COLORS.Bright, pokemon.toString());

}

main ();

