var App = {

	info: {},

	alert: window.alert.bind(),

	_init: function(){
		Date.prototype.getFullDate = function(){
			var yyyy = this.getFullYear().toString(),
				mm = (this.getMonth()+1).toString(),
				dd = this.getDate().toString(),
				hh = this.getHours().toString(),
				ii = this.getMinutes().toString(),
				ss = this.getSeconds().toString();

			return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0])
				+ ' ' + (hh[1] ? hh : "0" + hh[0]) + ':' + (ii[1] ? ii : "0" + ii[0]) + ':' + (ss[1] ? ss : "0" + ss[0]);
		};

		Storage.setDB('app');

		var app_info = Storage.select();

		//this['info'] = {};

		this['info']['is_installed'] = app_info['installed'] || 'no';
		this['info']['last_update'] = app_info['last_update'] || 'never';

		return this;
	},

	install: function(){
		Storage.setDB('app');

		return App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.trovati + ' prodotti importati');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}

			Storage.insert({'installed': 'yes'});
			Storage.insert({'last_update': 'never'});

			return this;
		});
	},

	update: function(){
		Storage.setDB('app');

		return App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.esistenti + ' prodotti aggiornati, ' + res_import.nuovi + ' prodotti nuovi');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}

			var d = new Date();

			storage.setItem('last_update', d.getFullDate());

			return this;
		});
	},

	Prodotti: {
		add: function(data){
			App.storage.setItem('prodotto_' + data.code, JSON.stringify(data));

			return this;
		},

		get: function(code){
			App.storage.getItem('prodotto_' + code);

			return this;
		},

		search: function(filters){
			var found = [];

			for(var i in App.storage){
				var storage_item = i;

				if(storage_item.indexOf('prodotto_') > -1){
					var prodotto = JSON.parse(App.storage.getItem(storage_item)),
						to_insert = true;

					if(filters.hasOwnProperty('txt')){
						if(prodotto.name.indexOf(filters.txt) > -1 || prodotto.description.indexOf(filters.txt) > -1){
							to_insert = true;
						}else{
							to_insert = false;
						}
					}

					if(filters.hasOwnProperty('category')){
						if(prodotto.category.indexOf(filters.category) > -1){
							to_insert = true;
						}else{
							to_insert = false;
						}
					}

					if(to_insert === true){
						found.push(prodotto);
					}
				}
			}

			return this;
		},

		import: function(){
			var esistenti = 0,
				nuovi = 0;

			Storage.setDB('prodotti');

			return App.Prodotti.get_repository().then(function(prodotti){
				if(prodotti.length){
					prodotti_storage = Storage.select();

					for(var i in prodotti){
						if(prodotti_storage.hasOwnProperty('code') && prodotti_storage[code] == prodotti[i].code){
							esistenti++;
						}else{
							nuovi++;
						}

						Storage.insert(prodotti[i].code, prodotti[i]);
					}
				}else{
					prodotti = [];
				}

				return { 'trovati': prodotti.length, 'esistenti': esistenti, 'nuovi': nuovi };

				return this;
			});
		},

		get_repository: function(){
			var prodotti;

			return prodotti = new Promise(function(r){
				r([
					{'code':'ABC123', 'name':'Forza10', 'category': 'Cura degli ambienti', 'description':'potente detersivo', 'price':'15.00'}
				]);
			});


			/*return App.ajax('prodotti.php?do=getall').then(function(xmlhttp){
				if(xmlhttp.status == 200){
					prodotti = JSON.parse(xmlhttp.response);
				}else{
					App.alert('Impossibile connettersi con il server (status ' + status + ')');
				}

				console.log(prodotti);

				return prodotti;
			});*/
		},
	},

	Ordini: {
		add: function(data){
			data.id = Date.now();

			App.storage.setItem('ordine_' + data.id, JSON.stringify(data));

			App.ajax('ordini.php?do=add', 'POST', {ordine: data}).then(function(){
				return data.id;
			});
		},

		update: function(data){
			App.storage.setItem('ordine_' + data.id, JSON.stringify(data));

			App.ajax('ordini.php?do=update', 'POST', {ordine: data});
		},

		get: function(id){
			return App.storage.getItem('ordine_' + id);
		},

		search: function(filters){
			var found = {};

			for(var i in App.storage){
				var storage_key = App.storage.key(i);

				if(storage_key.indexOf('ordine_') > -1){
					var ordine = JSON.parse(App.storage.getItem(storage_key));

					if(filters.destinatario){
						if(ordine.destinatario.indexOf(filters.destinatario) > -1){
							found[storage_key] = ordine;
						}else{
							delete found[storage_key];
						}
					}
				}
			}

			return found;
		},
	},

	Punti: {
		get: function(){
			return App.storage.getItem('punti');
		},

		update: function(p){
			var punteggio = App.Punti.get(),
				somma = parseInt(punteggio) + parseInt(p);

			App.storage.setItem('punti', somma);

			App.ajax('punti.php?do=update', 'GET', 'punti=' + somma).then(function(){
				return somma;
			});
		},
	},

	ajax: function(url, method, data){
		return new Promise(function(callback){
			var xmlhttp = new XMLHttpRequest();

			method = (method != 'GET' && method != 'POST') ? 'GET' : method;

			data = (!data) ? '' : data;

			xmlhttp.open(method, url, true);

			xmlhttp.onreadystatechange = function(){
				if(xmlhttp.readyState === 4){

					callback(xmlhttp);
				}
			};

			xmlhttp.onerror = function(){
				callback(xmlhttp);
			};

			xmlhttp.send(App.urlify_data(data));
		});
	},

	urlify_data: function(data){
		ret = '';

		if(typeof data == 'object'){
			var str = [];

			for(var k in obj) {
				if (obj.hasOwnProperty(k)) {
					str.push(typeof obj[k] == 'object' ? App.urlify_data(obj[k], k) : encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
				}
			}

			ret = str.join('&');
		}else{
			ret = data;
		}

		return ret;
	},

	$: function(selector){
		el = document.querySelectorAll(selector);

		this[0] = el;

		return this;
	},

	on: function(eventName, eventHandler, element){
		element = this._validElements(element);

		for(var i = 0; i < element.length; i++){
			element[i].addEventListener(eventName, eventHandler, false);
		}
	},

	addClass: function(className, element){
		element = this._validElements(element);

		for(var i = 0; i < element.length; i++){
			element[i].classList.add(className);
		}

		return this;
	},

	removeClass: function(className, element){
		element = this._validElements(element);

		for(var i = 0; i < element.length; i++){
			element[i].classList.remove(className);
		}

		return this;
	},

	_validElements: function(elemenet){
		element = (element == undefined) ? this[0] : element;

		if(!element.length){
			var element_ori = element,
				element = [];

			element.push(element_ori);
		}

		return element;
	}

};

