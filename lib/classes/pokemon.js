const Utils = require("../utils");
const { capitalise } = Utils;
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
	}
	
	static StatSymbols = {
		"hp": "❤️",
		"attack": "⚔️",
		"defense": "🛡",
		"special-attack": "⚔️",
		"special-defense": "🛡",
		"speed": "🏃",
	}

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

	#processTypes () {
		let types = {...this.types};
		let result = "";

		for (let type in types) {
			const typeName = capitalise(types[type]);
			result += `${typeName}\n`;
		}
		return result;

	}

	#processLocations () {
		let result = "";
		let locations = {...this.locations};
		for (let location in locations) {									
			let locationString = "";
			let methodString = "";

			location.replace(/-/g, " ").split(' ').forEach(word => {
				locationString += capitalise(word) + " ";
			});


			locations[location].forEach(word => {
				methodString += capitalise(word);
			});

			result += `${locationString} [Method - ${methodString}]\n`;
		}
		return result;
	}

	toString () {
		let str = "";
		str += `Info \n`;
		str += "=============\n";
		str += `Id : ${this.id}\n`;
		str += `Name : ${capitalise(this.name)}\n\n`;		
		

		if (Object.keys(this.locations).length === 0) {
			str += 'Locations  - \n';
		} else {
			str += `Locations \n`;
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