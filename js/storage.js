var Storage = {

	storage: localStorage,

	db: 'db',

	setDB: function(db_name){
		this.db = db_name;
	},

	insert: function(data){
		this.storage.setItem(this.db, JSON.stringify(data));
	},

	update: function(data){
		var db = this.storage[this.db],
			items = JSON.parse(db);

		items[data.id] = data;

		this.storage.removeItem(this.db);

		this.storage.setItem(this.db, JSON.stringify(items));
	},

	delete: function(id){
		var db = this.storage[this.db],
			items = JSON.parse(db);

		delete items[id];

		this.storage.removeItem(this.db);

		this.storage.setItem(this.db, JSON.stringify(items));
	},

	select: function(filters){
		var db = this.storage[this.db],
			items = JSON.parse(db),
			found = {};

		if(filters.length){
			for(var item in items){
				for(var filter in filters){
					if(item.hasOwnProperty(item.k) && item[item.k].indexOf(filter.v) > -1){
						found.push(item);
					}else{
						//found.push(item);
					}
				}
			}
		}else{
			found = items;
		}

		return found;
	}

}
