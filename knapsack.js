var Item = function(name, value, weight){
	this.name = name;
	this.value = value;
	this.weight = weight;

	this.getName = function(){
		return this.name;
	};
	this.getValue = function(){
		return this.value;
	};
	this.getWeight = function(){
		return this.weight;
	};
	this.stringify = function(){
		return 	"<" + 
	            this.getName() + 
	            ", " + 
	            this.getValue() + 
	            ", " + 
	            this.getWeight() +
	          ">";
	};
};

var Items = function(){
	var storage = [];
	this.addItem = function(item){
		storage.push(item);
	};
	this.size = function(){
		return storage.length;
	};
	this.itemAt = function(index){
		return storage[index];
	};
	this.stringify = function(){
	    var str = '[\n';
	    storage.forEach(function(item){
	        str += " " + item.stringify() + ", \n";
	    });
	    return str.slice(0, -3) + "\n ]";
	};
};

var buildItems = function(names, vals, weights){
	if(names.length !== vals.length || vals.length !== weights.length){
		throw new RangeError("Lengths don't match");
	}
	var items = new Items();
	
	names.forEach(function(name, index){
		items.addItem(new Item(name, vals[index], weights[index]));
	});

	return items;
};

var decToBin = function(n, numDigits){ 
    bStr = '';
    while (n > 0){
        bStr = n % 2 + bStr;
        n = Math.floor(n / 2);
    }
    while ( numDigits -  bStr.length > 0 ){
    	bStr = '0' + bStr;
    }
    return bStr;
};

var genPset = function(Items){
    var numSubsets = Math.pow(2, Items.size());
    var templates = [];
    for(var i = 0; i < numSubsets; i++){
        templates.push(decToBin(i, Items.size()));
    }
    return templates.map(function(template){
    	return	template
    						.split('')
    						.reduce(function(elems, digit, index){
    		  				if(digit === '1') {
    		  						elems.push(Items.itemAt(index));
    		  				}
  								return elems;
    						}, []);
    });
};

var chooseBest = function(pset, constraint){
    var bestVal = 0.0;
    var bestSet = null;
    pset.forEach(function(itemSet){
    	  var itemsVal = 0.0;
        var itemsWeight = 0.0;
        itemSet.forEach(function(item){
            itemsVal += item.getValue();
            itemsWeight += item.getWeight();
		        if(itemsWeight <= constraint && itemsVal > bestVal){
		            bestVal = itemsVal;
		            bestSet = itemSet;
		        }
        });
    });
    return [bestSet, bestVal];
}

var testBest = function(names, weights, vals){
    var items = buildItems(names, weights, vals);
    var pset = genPset(items);
    console.log(pset);
    var best = chooseBest(pset, 100)
    console.log('Total value of items taken = ' + best[1]);
    best[0].forEach(function(item){
    	console.log(item.stringify());
    });
}

var names = ['clock', 'painting', 'radio', 'vase', 'book', 'computer'];
var vals = [175, 90, 20, 50, 10, 200];
var weights = [10, 9, 4, 2, 1, 20];

testBest(names, weights, vals);


