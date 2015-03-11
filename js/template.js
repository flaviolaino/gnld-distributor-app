Template = {

	render: function(target, data){
		if(this.isArray(data)){
			data.forEach(function(el, i){
				return this.render(target, el);
			});
		}else{
			/*if(typeof data != 'string'){
				data = {data: data};
			}*/

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

	isArray: function(data){
		if(typeof Array.isArray === 'undefined'){
			Array.isArray = function(obj){
				return Object.prototype.toString.call(obj) === '[object Array]';
			}
		}

		return Array.isArray(data);
	}

};
