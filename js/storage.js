var Storage = {

	storage: localStorage,

	db: 'db',

	found: [],

	setDB: function(db_name){
		this.db = db_name;

		return this;
	},

	insert: function(id, data){
		var db = this.storage[this.db] || '[]',
			items = JSON.parse(db) || [];

		items.push({id: id, data: data});

		this.storage.setItem(this.db, JSON.stringify(items));

		return this;
	},

	update: function(id, data){
		var db = this.storage[this.db] || '[]',
			items = JSON.parse(db) || [];

		items[id] = data;

		this.storage.removeItem(this.db);

		this.storage.setItem(this.db, JSON.stringify(items));

		return this;
	},

	delete: function(id){
		var db = this.storage[this.db],
			items = JSON.parse(db);

		delete items[id];

		this.storage.removeItem(this.db);

		this.storage.setItem(this.db, JSON.stringify(items));

		return this;
	},

	select: function(filters){
		var db = this.storage[this.db] || '[]',
			items = JSON.parse(db),
			found = [],
			filters = filters || {};

		if(typeof filters == 'object' && Object.getOwnPropertyNames(filters).length !== 0){
			for(var i in items){
				var item = items[i],
					to_push = false;

				for(var filter in filters){
					if(item.hasOwnProperty(filter) && item[filter].indexOf(filters[filter]) > -1){
						to_push = true;
					}else{
						to_push = false;
					}
				}

				if(to_push === true){
					found.push(item);
				}
			}
		}else{
			found = items;
		}

		this.found = found;

		return this;
	}

}
