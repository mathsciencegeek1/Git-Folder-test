"use strict";

var allInputs=$("input");   //$(":input");
var arrayInputs=[];
var arrayInputsParent=[];
for (var i=1; i<=9; i+=1){
	arrayInputs[i]=[];
	arrayInputsParent[i]=[];
	for (var j=1; j<=9; j+=1){
		
		arrayInputs[i][j]=allInputs[9*(9-j)+i-1];
		arrayInputsParent[i][j]=$(arrayInputs[i][j]).parent();

	}
};

var Gnew;
var replaceGrid=function(replacementGrid){
	Gnew=replacementGrid;
	return replacementGrid;
}
var inputGrid=function(){
	allInputs=$("input");   //$(":input");
	arrayInputs=[];
	arrayInputsParent=[];
	for (var i=1; i<=9; i+=1){
		arrayInputs[i]=[];
		arrayInputsParent[i]=[];
		for (var j=1; j<=9; j+=1){
			
			arrayInputs[i][j]=allInputs[9*(9-j)+i-1];
			arrayInputsParent[i][j]=$(arrayInputs[i][j]).parent();

		}
	};
	var Ginput= new Grid();
	for (var i=1; i<=9; i+=1){
		for (var j=1; j<=9; j+=1){
			var inputValue=arrayInputs[i][j].value;
			if(inputValue>=1 && inputValue<=9){
				Ginput.assign(i, j, inputValue);
				
			}
		}
	} 
	return Ginput;
}


$(".Input button").click(function(){
	Gnew=inputGrid();
	
});
$(".refresh button" ).click(function(){
	refreshGrid();
})
$(".clear button").click(function(){
	replaceGrid(new Grid());
	refreshGrid();
})
var refreshGrid=function(){

	for (var i=1; i<=9; i+=1){
			for (var j=1; j<=9; j+=1){
				var displayNumber=Gnew.square[i][j].val;
				if(displayNumber>=1 && displayNumber<=9){
					
					// arrayInputsParent[i][j].removeAttr("input");
					arrayInputsParent[i][j].empty();
					arrayInputsParent[i][j].text(displayNumber);

					// $(arrayInputsParent[i][j]).replaceWith("<td>"+displayNumber+"</td>");
					// //arrayInputs[i][j]=
				}
				if (displayNumber===0){
					arrayInputsParent[i][j].empty();
					arrayInputsParent[i][j].append('<input type="text" size=1 maxlength="1">');

				}
		}
	}
	
}