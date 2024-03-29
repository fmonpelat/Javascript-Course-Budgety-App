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
            this.percentage = -1;
    };
    // added calculatePercentages method for Expense object
    Expense.prototype.calculatePercentages = function(totalIncome) {
        if(totalIncome>0) {
          this.percentage = Math.round((this.value / totalIncome )*100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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
        },
        budget: 0,
        percentage: -1,
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(val, i, index){
            sum += val.value;
        });
        data.totals[type] = sum;
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

        deleteItem: function(type, id){
            // id = 3
            var ids,index;
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1) {
              data.allItems[type].splice(index, 1);
            }
        },
        calculatePercentages: function() {
          data.allItems.exp.forEach(function(current) {
            current.calculatePercentages(data.totals.inc);
          });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income and expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of the income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
                percentage: data.percentage,
            }

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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month', 
    }

    var formatNumber = function(num, type) {
        var numSplit,int,dec,sign;
        /* + or - before number 
        exactly 2 decimal point
        comma separating the thousands
        */
       num = Math.abs(num);
       num = num.toFixed(2); // round to 2 decimals

       numSplit = num.split(".")
       int = numSplit[0];
       dec = numSplit[1];

       if(int.length > 3) {
           int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, int.length);
       }
       type === 'exp'? sign = '-': sign = '+';
       return sign + " " + int + '.' + dec;
    };

    var nodeListForEach = function(nodeList, callback) {
        for (var i=0; i<nodeList.length; i++) {
            callback(nodeList[i],i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescr).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
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
                html = '<div class="item clearfix" id="inc-%id%"> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"><div class="item__value">%value%</div>\
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"><div class="item__value">%value%</div> \
                <div class="item__percentage">21%</div> \
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Replace placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

            // Insert html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function() {
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescr+', '+ DOMstrings.inputValue);
            // we need to make an array from a list (we trick the prototype that it has an array)
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(val, i, array){
              val.value = "";
            });

            fieldsArr[0].focus();

        },
        displayBudget: function(obj) {
            //
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalsExp,'inc');
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalsInc,'exp');
            if(obj.percentage>0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }    
        },
        clearBudget: function() {
            document.querySelector(DOMstrings.budgetLabel).textContent = 0;
            document.querySelector(DOMstrings.expenseLabel).textContent = 0;
            document.querySelector(DOMstrings.incomeLabel).textContent = 0;
            document.querySelector(DOMstrings.percentageLabel).textContent = '--';
        },
        displayPercentages: function(percentages) {
          // fields are list of nodes (they do not have the foreach (nodelist to array))
          var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

          nodeListForEach(fields,function(current,index){
              if(percentages[index]>0){
                current.textContent = percentages[index]+'%';
              }
              else {
                current.textContent = '---';
              }
          });
        },
        displayDate: function() {
            var now, year, month;
            now = new Date();
            year = now.getFullYear();
            //month = now.getMonth();
            month = now.toLocaleString('default', { month: 'long' });
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;
        },
        changedType: function() {
            var fields = document.querySelectorAll(DOMstrings.inputType+','+DOMstrings.inputDescr+','+DOMstrings.inputValue);
            nodeListForEach(fields,function(current){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.buttonAdd).classList.toggle('red');
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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    };

    var updateBudget = function() {

        var budget;

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
      var percentages;
      // 1. calculate percentages
      budgetCtrl.calculatePercentages();
      // 2. read percentages from the budget controller
      percentages = budgetCtrl.getPercentages();
      // 3. Update the UI with the new percentages
      UICtrl.displayPercentages(percentages);
    }

    var controlAddItem = function() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0 )
        {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI 
            UICtrl.addListItem(newItem,input.type);

            // 4. Clearing the fields in the UI
            UICtrl.clearFields();

            // 5.Update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }   
    }

    var ctrlDeleteItem = function(event) {
        var itemID,splitID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
        }
    }

    return {
        init: function() {
            console.log("App has started!");
            setupEventListeners();
            UICtrl.clearBudget();
            UICtrl.displayDate();

        }
    }

})(budgetController, UIController);



Controller.init();