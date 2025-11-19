// @ts-nocheck

const defineNonEnum = (proto, name, value) => {
	Object.defineProperty(proto, name, {
		value,
		writable: true,
		configurable: true,
		enumerable: false,
	});
};

const objectExtensions = {
	let: function (block) {
		return block(this);
	},
	also: function (block) {
		block(this);
		return this;
	},
	run: function (block) {
		return block.call(this);
	},
	apply: function (block) {
		block.call(this);
		return this;
	},
	takeIf: function (predicate) {
		return predicate(this) ? this : undefined;
	},
	takeUnless: function (predicate) {
		return predicate(this) ? undefined : this;
	},
};

for (const [name, func] of Object.entries(objectExtensions)) {
	defineNonEnum(Object.prototype, name, func);
}

const primitiveExtensions = {
	let: function (block) {
		return block(this.valueOf());
	},
	also: function (block) {
		block(this.valueOf());
		return this.valueOf();
	},
	run: function (block) {
		return block.call(this.valueOf());
	},
	apply: function (block) {
		block.call(this.valueOf());
		return this.valueOf();
	},
	takeIf: function (predicate) {
		const value = this.valueOf();
		return predicate(value) ? value : undefined;
	},
	takeUnless: function (predicate) {
		const value = this.valueOf();
		return predicate(value) ? undefined : value;
	},
};

for (const [name, func] of Object.entries(primitiveExtensions)) {
	defineNonEnum(Number.prototype, name, func);
	defineNonEnum(String.prototype, name, func);
}

const booleanExtensions = {
	...primitiveExtensions,
	takeIf: function (predicate) {
		const value = this.valueOf();
		const condition = predicate ? predicate(value) : value;
		return condition ? value : undefined;
	},
	takeUnless: function (predicate) {
		const value = this.valueOf();
		const condition = predicate ? predicate(value) : value;
		return condition ? undefined : value;
	},
};

for (const [name, func] of Object.entries(booleanExtensions)) {
	defineNonEnum(Boolean.prototype, name, func);
}

export {};
