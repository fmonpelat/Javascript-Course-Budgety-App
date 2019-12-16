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
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescr).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },
        getDOMstrings: function(){
            return DOMstrings;
        },
        addListItem: function(obj, type) {

            var html,newHtml,element;
            // Create html string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"><div class="item__value">%value%</div>\
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"><div class="item__value">%value%</div> \
                <div class="item__percentage">21%</div> \
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Replace placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            // Insert html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

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
        UICtrl.addListItem(newItem,input.type);
        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: function() {
            console.log("App has started!");
            setupEventListeners();
        }
    }

})(budgetController, UIController);



Controller.init();