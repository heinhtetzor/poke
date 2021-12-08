/**
 * @class {Utils}
 * @description A collection of utility functions to transform raw api responses to managable data. This class is tightly coupled to the api.
 */
class Utils {
	/**
	 * @param  {array} encounters
	 * @param  {string} location
	 * @returns {object} encounters
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
}
module.exports = Utils;