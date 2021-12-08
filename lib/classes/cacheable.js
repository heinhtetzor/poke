const fs = require('fs');

class Cacheable {
	fileName;
	ttl;
	data;

	constructor({fileName, ttl}) {		
		this.fileName = fileName;
		this.ttl = ttl;

		this.init();			
	}

	init() {
		const text = fs.readFileSync(this.fileName, 'utf8');
		this.data = JSON.parse(text || "{}");
	}

	get(key) {
		return this.data[key]["content"];
	}

	has(key) {
		const isValid = this.data.hasOwnProperty(key)
		&& this.data[key]["expiry"] > Date.now();
		return isValid;
	}

	set(key, data) {
		const expiry = Date.now() + this.ttl
		this.data[key] = {
			content: data,
			expiry
		}		

		fs.writeFile(this.fileName, JSON.stringify(this.data), (err) => {
			if (err) console.error(err);
		});
		return data;
	}

	flush(key) {
		return this.cache.remove(key);
	}
}
module.exports = Cacheable;