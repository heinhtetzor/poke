class Config {
	constructor(config={}) {
		this.baseUrl = config.baseUrl || 'https://pokeapi.co/api/v2/pokemon/';
		this.fixedPokemonLocation = "kanto"
  	}
}

module.exports = Config;