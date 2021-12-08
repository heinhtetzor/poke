const { default: axios } = require("axios");
const Config = require("../config/config");
const { COLORS } = require("../utils/console-writer");
const ConsoleWriter = require("../utils/console-writer");

/**
 * @class PokeWrapper
 * @description Wrapper for PokeAPI. Exposes two response objects from two api calls. Objects will be available after init() call.
 */

class PokeWrapper {
	pokemonResponse;
	encounterResponse;
	
	constructor({ query }) {
		this.config = new Config();
		this.param = query;
		this.url = this.config.baseUrl + query;
	}

	async init () {
		try {
			await this.getPokemon();
			await this.getEncounters();
		}
		catch (err)
		{
			ConsoleWriter.outWithColor(COLORS.BgRed, err.response.status === 404 ? "Pokemon not found" : "Error fetching pokemon");
			process.exit()
		}
	}
	
	async getPokemon() {
		try {
			const { data } = await axios.get(this.url);
			const { id, name, types, stats } = data;
			this.pokemonResponse = { id, name, types, stats };
		}
		catch (err) {
			throw err;
		}
	}

	async getEncounters() {
		try {
			const url = this.config.baseUrl + this.pokemonResponse.id + "/encounters";
			const { data } = await axios.get(url);
			this.encounterResponse = data;
		}
		catch (err) {
			console.log(err)
			ConsoleWriter.outWithColor(COLORS.BgRed, err.response.status === 404 ? "Encounter Not Found" : "Error fetching Encounters");
			process.exit();
		}
	}
	


}
module.exports = PokeWrapper;