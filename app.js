

//Budget Controller
var budgetController = (function(){
//some code




})();

//UI Controller
var UIController = (function() {

	var DOMstrings = {

		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		inputKeyPress: 'keypress'
	};

	return {
		getInput: function() {
			return{
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
			
		},
		getDOMstrings: function() {
			return DOMstrings;
		}

	};


})();


//Global App Controller
var controller =(function(budgetCntrl, UICntrl) {

	var DOM = UICntrl.getDOMstrings();

	var cntrlAddItem = function(){
			// 1. Get field input data
		var input = UICntrl.getInput();
			console.log(input);
		// 2. Add item to budget controller
		//3. Add the new item to the user interface
		//4. Calculate the budget
		//5. Display the budget

		console.log('so it works')

	}

	document.querySelector(DOM.inputBtn).addEventListener('click', cntrlAddItem);


	


	document.addEventListener(DOM.inputKeyPress, function(event){
		if(event.keycode ===13 || event.which === 13 ){
			cntrlAddItem();
		}

	});




})(budgetController, UIController);