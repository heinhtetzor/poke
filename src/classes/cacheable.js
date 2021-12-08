const fs = require('fs');

/**
 * @class Cacheable
 */
class Cacheable {
	constructor({fileName, ttl}) {		
		this.fileName = fileName;
		this.ttl = ttl;

		this.init();			
	}

	init() {
		const text = fs.readFileSync(this.fileName, 'utf8', err => {
			if (err) {
				this.flush();
				process.exit();
			};
		});
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

		fs.writeFileSync(this.fileName, JSON.stringify(this.data), (err) => {
			if (err) console.error(err);
		});
		return data;
	}

	flush() {
		fs.writeFile(this.fileName, '', (err) => {
			if (err) console.error(err);
		});
		return true;
	}
}
module.exports = Cacheable;