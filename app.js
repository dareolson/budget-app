

//Budget Controller
var budgetController = (function(){
//some code




})();

//UI Controller
var UIController = (function(){

	//some code


})();


//Global App Controller
var controller =(function(budgetCntrl, UICntrl) {

	var cntrlAddItem = function(){
			// 1. Get field input data
		// 2. Add item to budget controller
		//3. Add the new item to the user interface
		//4. Calculate the budget
		//5. Display the budget

		console.log('so it works')

	}

	document.querySelector('.add__btn').addEventListener('click', cntrlAddItem);


	


	document.addEventListener('keypress', function(event){
		if(event.keycode ===13 || event.which === 13 ){
			cntrlAddItem();
		}

	});




})(budgetController, UIController);