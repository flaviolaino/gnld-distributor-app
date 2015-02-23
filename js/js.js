var Categorie_Prodotti = ['Integratori alimentari', 'A base di erbe', 'Controllo del peso', 'Cura della pelle', 'Cura della persona', 'Cura degli ambienti', 'Prodotti Industriali', 'Materiale promozionale'];

function init(){
	App.$('.btn-go-to').on('click', function(ev){
		goto(this.getAttribute('goto'));
	});

	App.$('#do_install').on('click', function(){
		App.install();
	});
}

function goto(section_name){
	var sections = App.$('.section');

	for(i = 0; i < sections.length; i++){
		sections[i].classList.remove('shown');
	}

	view_Section_Handlers(section_name);

	App.$('#section_' + section_name)[0].classList.add('shown');
}

function view_Section_Handlers(section_name){
	var section_handlers = {
		'Prodotti': print_Prodotti,
		'Ordini': '',
		'Punti': ''
	};

	if(section_handlers[section_name]){
		section_handlers[section_name]();
	}
}

function print_Prodotti(){
	var catalogo = [],
		catalogo_container = App.$('#catalogo_container tbody')[0];

	catalogo_container.innerHTML = '';

	Categorie_Prodotti.forEach(function(el, i){
		var found = App.Prodotti.search({category: el});

		catalogo.push({is_cat: true, txt: el});
console.log(found);
		if(found.length){
			for(var i in found){
				var obj = found[i];

				catalogo.push({is_cat: false, info: obj});
			}
		}
	});

	if(catalogo.length){
		catalogo.forEach(function(el, i){
			var to_append;
			//console.log(el);

			if(el.is_cat == true){
				var tr = document.createElement('tr'),
					td = document.createElement('td'),
					txt = document.createTextNode(el.txt);

				td.classList.add('categoria-prodotto');

				td.appendChild(txt);
				tr.appendChild(td);

				to_append = tr;
			}else{
				var tr = document.createElement('tr'),
					td_codice = document.createElement('td'),
					td_nome = document.createElement('td'),
					td_prezzo = document.createElement('td'),
					txt_codice = document.createTextNode(el.code),
					txt_nome = document.createTextNode(el.name),
					txt_prezzo = document.createTextNode(el.price);

				td_codice.setAttribute('goto', 'Prodotto');
				td_nome.setAttribute('goto', 'Prodotto');
				td_prezzo.setAttribute('goto', 'Prodotto');

				td_codice.classList.add('btn-go-to');
				td_nome.classList.add('btn-go-to');
				td_prezzo.classList.add('btn-go-to');

				td_codice.appendChild(txt_codice);
				td_nome.appendChild(txt_nome);
				td_prezzo.appendChild(txt_prezzo);

				tr.appendChild(td_codice);
				tr.appendChild(td_nome);
				tr.appendChild(td_prezzo);

				to_append = tr;
			}

			catalogo_container.appendChild(to_append);
		});
	}else{
		var tr = document.createElement('tr'),
			td = document.createElement('td'),
			txt = document.createTextNode('Nessun prodotto trovato');

		td.appendChild(txt);
		tr.appendChild(td);

		catalogo_container.appendChild(tr);
	}
}
