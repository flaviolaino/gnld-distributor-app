Template = {

	render: function(target, data){
		if(Template.isArray(data)){
			for(var className in data[0]) break;

			var children = target.getElementsByClassName(className);

			Template.clone(children[0], data.length - 1);

			for(var i = 0; i <= children.length; i++){
				if(children[i] != undefined){
					children[i].insertAdjacentHTML('beforeend', data[i][className]);
				}
			}

		}else{
			for(var i in data){
				var children = target.getElementsByClassName(i);

				if(children.length > 0){
					for(var ii = 0; ii <= children.length; ii++){
						if(children[ii] != undefined){
							children[ii].insertAdjacentHTML('beforeend', data[i]);
						}
					}

				}
			}
		}
	},

	clone: function(target, n){
		var parent = target.parentNode;

		for(var i = 0; i < n; i++){
			var cloned = target.cloneNode(true);

			parent.appendChild(cloned);
		}
	},

	isArray: function(data){
		if(typeof Array.isArray === 'undefined'){
			Array.isArray = function(obj){
				return Object.prototype.toString.call(obj) === '[object Array]';
			}
		}

		return Array.isArray(data);
	}

};
