

//Budget Controller
var budgetController = (function(){

		var Expense = function(id, description, value){
			this.id = id;
			this.description = description;
			this.value = value;
		};

		var Income = function(id, description, value){
			this.id = id;
			this.description = description;
			this.value = value;

		};

		var data = {
			allItems: {
				exp: [],
				inc: []
			},

			totals: {
				exp: 0,
				inc: 0
			}

		};

		return {
			addItem: function(type, desc, val){
				var newItem, ID;

				//create new id
				if (data.allItems[type].length > 0 ){
					ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
				} else {
					ID = 0;
				}
				

				//create new item based on type

				if (type === 'exp'){
					newItem = new Expense(ID, desc, val);
				} else if (type === 'inc') {
					newItem = new Income(ID, desc, val);
				}
				//push into the data structure
				data.allItems[type].push(newItem);
				//return the element
				return newItem;

				

			},

			testing: function(){

				console.log(data);
			}
		};




})();

//UI Controller
var UIController = (function() {

	var DOMstrings = {

		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		inputKeyPress: 'keypress',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	};

	return {
		getInput: function() {
			return{
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
			
		},

		addListItem: function(obj, type){
			//Create HTML string with placeholder text
			var html, newHtml, element;

			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

		 		html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		 	}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);




			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function(){
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			//for each method loops over all of the elements fo the fields array and then sets the value back to empty string.

			fieldsArr.forEach(function(current, index, array) {
				current.value = "";

			});

			fieldsArr[0].focus();

		},


		getDOMstrings: function() {
			return DOMstrings;
		}

	};


})();


//Global App Controller
	var controller =(function(budgetCntrl, UICntrl) {

		var setupEventListeners = function(){
			var DOM = UICntrl.getDOMstrings();

			document.querySelector(DOM.inputBtn).addEventListener('click', cntrlAddItem);

			document.addEventListener(DOM.inputKeyPress, function(event){
				if(event.keycode ===13 || event.which === 13 ){
				cntrlAddItem();
			}
		});
	};

	var updateBudget = function(){


	};

	var cntrlAddItem = function(){

		var input, newItem;

			// 1. Get field input data
		input = UICntrl.getInput();
			console.log(input);

		// 2. Add item to budget controller
		newItem = budgetCntrl.addItem(input.type, input.description, input.value, input.ID);

		//3. Add the new item to the user interface and clear the fields
		UICntrl.addListItem(newItem, input.type);

		UICntrl.clearFields();

		//4. Calculate the budget

		//5. Display the budget

		console.log('so it works')

	};

	return {
		init: function(){
			console.log('Application has started');
			setupEventListeners();
		}
	};





})(budgetController, UIController);

controller.init();