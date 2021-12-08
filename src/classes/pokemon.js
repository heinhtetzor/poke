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
						
			methods.forEach(method => {
				const arr = [];
				method.split('-').forEach((word, idx) => {
					arr.push(capitalise(word));
				});
				methodString += arr.join(', ');
			});

			result += `${locationString} [Method - ${methodString}]\n`;
		}
		return result;
	}

	
	/**
	 * exposed method to get pokemon details in beautified string format
	 */
	toString () {
		let str = "Pokemon Found!\n";
		str += `Info \n`;
		str += "=============\n";
		str += `Id : ${this.id}\n`;
		str += `Name : ${capitalise(this.name)}\n\n`;		
		

		const num_of_location = Object.keys(this.locations).length;
		if (num_of_location === 0) {
			str += 'Location  - \n';
			str += "=============\n\n";
		} else {
			let locationLabel = num_of_location > 1 ? "Locations" : "Location";
			str += `${locationLabel} in ${capitalise(this.config.fixedPokemonLocation)} \n`;
			str += "=============\n";
			str += this.#processLocations() + "\n";
		}

		let typeLabel = this.types.length > 1 ? "Types" : "Type";
		str += `${typeLabel} \n`;
		str += "=============\n";
		str += this.#processTypes() + "\n";
		
		str += 'Stats \n';
		str += "=============\n";
		str += this.#processStats();	
		
		return str;
	}
}
module.exports = Pokemon;