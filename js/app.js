var App = {

	storage: localStorage || window.localStorage,

	alert: window.alert.bind(),

	install: function(){
		App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.trovati + ' prodotti importati');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}
		});
	},

	update: function(){
		App.Prodotti.import().then(function(res_import){
			if(res_import.trovati > 0){
				App.alert(res_import.esistenti + ' prodotti aggiornati, ' + res_import.nuovi + ' prodotti nuovi');
			}else{
				App.alert('Non ho trovato nessun prodotto');
			}
		});
	},

	Prodotti: {
		add: function(data){
			App.storage.setItem('prodotto_' + data.code, JSON.stringify(data));
		},

		get: function(code){
			return App.storage.getItem('prodotto_' + code);
		},

		search: function(filters){
			var found = [];

			for(var i in App.storage){
				var storage_key = App.storage.key(i);

				if(storage_key.indexOf('prodotto_') > -1){
					var prodotto = JSON.parse(App.storage.getItem(storage_key));

					if(filters.txt){
						if(prodotto.name.indexOf(filters.txt) > -1 || prodotto.description.indexOf(filters.txt) > -1){
							found[storage_key] = prodotto;
						}else{
							delete found[storage_key];
						}
					}

					if(filters.category){
						if(prodotto.category.indexOf(filters.category) > -1){
							found[storage_key] = prodotto;
						}else{
							delete found[storage_key];
						}
					}
				}
			}

			return found;
		},

		import: function(){
			var esistenti = 0,
				nuovi = 0;

			return App.Prodotti.get_repository().then(function(prodotti){
				if(prodotti.length){
					prodotti_storage = App.storage.getItem['prodotti'] || '{}';

					prodotti_storage = JSON.parse(prodotti_storage);


					for(var i in prodotti){
						if(App.storage.getItem['prodotto_' + prodotti[i].code]){
							esistenti++;
						}else{
							nuovi++;
						}

						App.storage.setItem('prodotto_' + prodotti[i].code, JSON.stringify(prodotti[i]));
					}
				}else{
					prodotti = [];
				}

				return { 'trovati': prodotti.length, 'esistenti': esistenti, 'nuovi': nuovi };
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

		el.on = function(eventName, eventHandler){
			App.on(el, eventName, eventHandler);
		};

		return el;
	},

	on: function(element, eventName, eventHandler){
		for(var i = 0; i < element.length; i++){
			element[i].addEventListener(eventName, eventHandler, true);
		}
	}

};

