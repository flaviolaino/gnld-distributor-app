var Categorie_Prodotti = ['Integratori alimentari', 'A base di erbe', 'Controllo del peso', 'Cura della pelle', 'Cura della persona', 'Cura degli ambienti', 'Prodotti Industriali', 'Materiale promozionale'];

function init(){
	App._init();

	if(App.info.is_installed == 'no'){
		App.$('.btn-goto-Install').removeClass('btn-go-to');
		App.$('.btn-goto-Install').addClass('btn-go-to-disabled');
	}

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

	App.$('#section_' + section_name).addClass('shown');
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
			console.log(el);

			if(el.is_cat === true){
				var tr = document.createElement('tr'),
					td = document.createElement('td'),
					txt = document.createTextNode(el.txt);

				td.classList.add('categoria-prodotto');

				td.appendChild(txt);
				tr.appendChild(td);

				to_append = tr;
			}else{
				var tr = document.createElement('tr'),
					td = document.createElement('td'),
					span_codice = document.createElement('span'),
					span_nome = document.createElement('span'),
					span_prezzo = document.createElement('span'),
					txt_codice = document.createTextNode(el.info.code),
					txt_nome = document.createTextNode(el.info.name),
					txt_prezzo = document.createTextNode(el.info.price);

				td.setAttribute('goto', 'Prodotto');

				td.classList.add('btn-go-to');

				span_codice.classList.add('prodotto-code');
				span_nome.classList.add('prodotto-name');
				span_prezzo.classList.add('prodotto-price');

				span_codice.appendChild(txt_codice);
				span_nome.appendChild(txt_nome);
				span_prezzo.appendChild(txt_prezzo);

				td.appendChild(span_codice);
				td.appendChild(span_nome);
				td.appendChild(span_prezzo);

				tr.appendChild(td);

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
