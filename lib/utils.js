const { type } = require("os");
const Config = require("./config/Config");

function isPrimitive (value){
	return Object(value) !== value;
}

class Utils {
	/**
	 * @param  {array} encounters
	 * @param  {string} location
	 * @returns {set} encounters
	 */
	static getEncountersByLocation(encounters, location) {
		const map = new Map();
		encounters.forEach (encounter => {
			const location_name = encounter.location_area.name;
			if (location_name.includes(location)) {
				if (! map.has(location_name)) {
					map.set(location_name, []);
				}
				encounter.version_details.forEach (versionDetails => {
					versionDetails.encounter_details.forEach (encounterDetails => {
						map.get(location_name).push(encounterDetails.method.name);
					})
				})
				map.set(location_name, [...new Set(map.get(location_name))]);
			}
		})
		return Object.fromEntries(map);
	}

	/**
	 * @param  {array} typesResponse
	 * @returns {array} types
	 */
	static getTypes (typesResponse) {		
		const types = typesResponse.reduce((acc, {type}) => {
			acc.push(type.name);
			return acc;
		}, []);
		return types;
	}

	/**
	 * @param  {array} statsResponse
	 * @returns {object} stats
	 */
	static getStats (statsResponse) {
		const stats = statsResponse.reduce((acc, {base_stat, stat}) => {
			const { name } = stat;
			acc[name] = base_stat;
			return acc;
		}, {});
		return stats;
	}

	static capitalise (string) {		
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static stringify (...args) {
		const config = new Config();
		let text = "";
		args.forEach ((arg, idx) => {
			if (isPrimitive(arg)) {
				text += `${config.displayOrder[idx]} - ${arg} \n`;
			}
			if (typeof arg === 'object') {
				text += `${config.displayOrder[idx]} - `;
				for (let key in arg) {
					text += `${arg[key]}, `;
				}
				text += '\n';
			}
		})
		// console.log(text);
	}

}
module.exports = Utils;