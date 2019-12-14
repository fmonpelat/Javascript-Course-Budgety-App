// TO keep in mind:
// use of IIFE for separation of objects modules
// separation of concerns (do one thing independently)

// BUDGET CONTROLLER
var budgetController = (function() {

    // data model for expenses
    var Expense = function(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem;
            var ID;
            ID=0;

            // create the ID
            if(data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 ;
            }
            else{
                ID=0;
            }

            // create new item on 'inc' or 'exp' type
            if(type==='exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push it to our data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescr: '.add__description',
        inputValue: '.add__value',
        buttonAdd: '.add__btn',
    }
    var getInput = function() {
        return {
            type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
            description: document.querySelector(DOMstrings.inputDescr).value,
            value: document.querySelector(DOMstrings.inputValue).value,
        }
    }

    return {
        getInput: getInput,
        getDOMstrings: function(){
            return DOMstrings;
        }

    };

})();

// GLOBAL APP CONTROLLER
var Controller = (function(budgetCtrl,UICtrl) {

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        // button click handler
        document.querySelector(DOM.buttonAdd).addEventListener('click',controlAddItem);

        // function to get the enter keypress and exec handler
        document.addEventListener('keypress',function(event) {
            // which event for older browsers
            if(event.keyCode === 13 || event.which === 13 )
            {
                controlAddItem();
            }
        });
    };

    
    var controlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the new item to the UI 

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: function() {
            console.log("App has started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);



Controller.init();