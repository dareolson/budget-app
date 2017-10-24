

//Budget Controller
var budgetController = (function(){

		var Expense = function(id, description, value){
			this.id = id;
			this.description = description;
			this.value = value;
			this.percentage = -1;
		};

		Expense.prototype.calcPercentage = function(totalIncome){
			
			if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
			} else {
				this.percentage = -1;
			}
		};

		Expense.prototype.getPercentage = function() {
				return this.percentage;
		};

		var Income = function(id, description, value){
			this.id = id;
			this.description = description;
			this.value = value;

		};

		var calculateTotal = function(type) {
			var sum = 0;
			data.allItems[type].forEach(function(cur){
				sum += cur.value;
			});

			data.totals[type] = sum;


		};

		var data = {
			allItems: {
				exp: [],
				inc: []
			},

			totals: {
				exp: 0,
				inc: 0
			},

			budget: 0,
			percentage: -1

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

			deleteItem: function(type, id){
				var ids, index;

				ids = data.allItems[type].map(function(current){
					return current.id;
				});

				index = ids.indexOf(id);

				if (index !== -1){
					data.allItems[type].splice(index, 1);
				}
			},

			calculateBudget: function(){

				// calcutlate total income and expenses
				calculateTotal('exp');
				calculateTotal('inc');

				// calculate the budget: income - expenses
				data.budget = data.totals.inc - data.totals.exp;

				//calculate the percentage of income we spent

				if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
				} else {
					data.percentage = -1;
				}
			},

			calculatePercentages: function(){

				data.allItems.exp.forEach(function(current) {

					current.calcPercentage(data.totals.inc);
				});
			},

			getPercentages: function() {

				var allPerc = data.allItems.exp.map(function(current){

					return current.getPercentage();
				});

				return allPerc;
			},

			getBudget: function() {
				return {
					budget: data.budget,
					totalInc: data.totals.inc,
					totalExp: data.totals.exp,
					percentage: data.percentage
				}
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
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};


		var formatNumber = function(num, type){
			var numSplit, int, dec, type;
			//+ or - before the number
			// 2 decimal points 
			//comma separating thousands

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];
			if (int.length > 3) {
				int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
			}

			dec = numSplit[1];			

			return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;

		};

		var nodeListForEach = function(list, callback){
				for (var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};

		return {
		getInput: function() {
			return{
				type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
			
		},

		addListItem: function(obj, type){
			//Create HTML string with placeholder text
			var html, newHtml, element;

			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

		 		html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		 	}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));




			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID){
			var el

			el = document.getElementById(selectorID);

			el.parentNode.removeChild(el);
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

		displayBudget: function (obj) {

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '----'
			}

		},

		displayPercentages: function(percentages){

			var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);


			nodeListForEach(fields, function(current, index){

				if (percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}	
			});
		},

		displayMonth: function(){
			var now, year, month, months, days;

			now = new Date();

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

			month = now.getMonth();

			day = now.getDay();

			date = now.getDate();

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = days[day] + ' ' + months[month] + ' ' + date + ', ' + year;
		},

		changedType: function() {

			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

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
			
			document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem);

			document.querySelector(DOM.inputType).addEventListener('change', UICntrl.changedType);
	};

	var updateBudget = function(){
		
		//1. Calculate the budget
		budgetCntrl.calculateBudget();
		
		//2. Return the budget
		var budget = budgetCntrl.getBudget();
		console.log(budget);

		//5. Display the budget
		UICntrl.displayBudget(budget);

	};

	var updatePercentages = function(){
		// 1. Calculate percentages
		budgetCntrl.calculatePercentages();

		// 2. read percentages from budget controller
		var percentages = budgetCntrl.getPercentages();
		// 3. update UI
		UICntrl.displayPercentages(percentages);
	};

	var cntrlAddItem = function(){

		var input, newItem;

			// 1. Get field input data
		input = UICntrl.getInput();
			console.log(input);

		// 2. Add item to budget controller
		if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
				newItem = budgetCntrl.addItem(input.type, input.description, input.value, input.ID);

		//3. Add the new item to the user interface and clear the fields
		UICntrl.addListItem(newItem, input.type);

		UICntrl.clearFields();

		//5. Calculate and update budget

		updateBudget();

		console.log('so it works')

		} else {
			UICntrl.clearFields();
		}

		updatePercentages();

	};

	var cntrlDeleteItem = function(event){
			var itemID, splitID, type, ID;
			itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

			if (itemID) {

				//inc-1
				splitID = itemID.split('-');
				type = splitID[0];
				ID = parseInt(splitID[1]);

				// 1. delete the item from the data structure
				budgetCntrl.deleteItem(type, ID);
				// 2. Delete from the user interface
				UICntrl.deleteListItem(itemID);

				// 3. Update and show from the new budget
				updateBudget();

				// 4. Calculate and update percentages
				updatePercentages(); 

			}


	};

	return {
		init: function(){
			console.log('Application has started');
			UICntrl.displayMonth();
			UICntrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};





})(budgetController, UIController);

controller.init();