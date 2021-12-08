class Config {
	constructor(config={}) {
		this.baseUrl = config.baseUrl || 'https://pokeapi.co/api/v2/pokemon/';
		this.displayOrder = [
			'Id',
			'Name',
			'Locations',
			'Types',
			'Stats',
		]
  	}
}

module.exports = Config;