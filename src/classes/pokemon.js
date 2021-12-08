const Config = require("../config/config");
const Utils = require("../utils/utils");
const { capitalise } = Utils;

/**
 * @class Pokemon
 * Purpose of this class is to represent a Pokemon in digestable format.
 * 
 */
class Pokemon {
	constructor ({
		id,
		name,
		locations,
		types,
		stats
	}) {
		this.id = id;
		this.name = name;
		this.locations = locations;
		this.types = types;
		this.stats = stats;
		this.config = new Config();
	}
	
	static StatSymbols = {
		"hp": "❤️",
		"attack": "⚔️",
		"defense": "🛡",
		"special-attack": "⚔️",
		"special-defense": "🛡",
		"speed": "🏄‍♂️",
	}

	/**
	 * helper function to process pokemon stats object and format it to string with stars and emojis
	 * @returns {string}
	 */
	#processStats () {
		let result = "";
		let stats = {...this.stats};
		for (let stat in stats) {
			const symbol = Pokemon.StatSymbols[stat];

			const statName = stat.toUpperCase();
			result += symbol +" " + statName.replace('-', ' ') + "\t";

			const count = Math.round(stats[stat]/10);
			for (let i = 0; i < count; i++) {
				result += '⭐';
			}
			result += `[${stats[stat]}]\n`;
		}
		return result;
	}

	/**
	 * helper function to process pokemon type object and format it to string
	 * @returns {string}
	 */
	#processTypes () {
		let types = {...this.types};
		let result = "";

		for (let type in types) {
			const typeName = capitalise(types[type]);
			result += `${typeName}\n`;
		}
		return result;
	}

	/**
	 * helper function process location object and format it to string
	 * @returns {string}
	 */
	#processLocations () {
		let result = "";
		let locations = {...this.locations};
		for (let location in locations) {									
			let locationString = "";
			let methodString = "";

			location.replace(/-/g, " ").split(' ').slice(1).forEach(word => {
				locationString += capitalise(word) + " ";
			});

			let methods = locations[location];
			methods.forEach(word => {
				methodString += capitalise(word);
			});

			result += `${locationString} [Method - ${methodString}]\n`;
		}
		return result;
	}

	
	/**
	 * exposed method to get pokemon details in beautified string format
	 */
	toString () {
		let str = "";
		str += `Info \n`;
		str += "=============\n";
		str += `Id : ${this.id}\n`;
		str += `Name : ${capitalise(this.name)}\n\n`;		
		

		if (Object.keys(this.locations).length === 0) {
			str += 'Location  - \n';
		} else {
			str += `Locations in ${capitalise(this.config.fixedPokemonLocation)} \n`;
			str += "=============\n";
			str += this.#processLocations() + "\n";
		}

		str += `Types \n`;
		str += "=============\n";
		str += this.#processTypes() + "\n";
		
		str += 'Stats \n';
		str += "=============\n";
		str += this.#processStats();	
		
		return str;
	}
}
module.exports = Pokemon;