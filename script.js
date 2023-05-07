// Constants
const OPERATIONS = {
    ADDITION: "+",
    SUBTRACTION: "-",
    MULTIPLICATION: "×",
    DIVISION: "÷",
};

// Variables
let targetNumber;
let selectedNumber;
let selectedNumber2;
let selectedOperation;
let originalNumbers = [];

// Functions
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTargetNumber() {
    const min = 50;
    const max = 600;
    targetNumber = getRandomInteger(min, max);
    document.querySelector("#target-number").textContent = targetNumber;
}

function generateNumberGrid() {
    while (originalNumbers.length < 6) {
        const num = Math.floor(Math.random() * 25) + 1;
        if (!originalNumbers.includes(num)) {
            originalNumbers.push(num);
        }
    }
    const numberDivs = document.querySelectorAll(".number");
    numberDivs.forEach((div, index) => {
        div.textContent = originalNumbers[index];
        div.addEventListener("click", handleClick);
    });
}

function resetGame() {
    // Remove the "selected" class from all the numbers
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
      number.classList.remove('selected1');
      //number.classList.remove('selected2');
    });
  
    // Remove the "selectedOperation" class from all the operations
    const operations = document.querySelectorAll('.operation');
    operations.forEach(operation => {
      operation.classList.remove('selectedOperation');
    });
  
    // Clear the message
    document.querySelector('#message').textContent = '';
  
    // Reset the numbers to the original numbers
    const numberDivs = document.querySelectorAll(".number");
    numberDivs.forEach((div, index) => {
        div.textContent = originalNumbers[index];
        div.addEventListener("click", handleClick);
    });
}

function calculateResult(number1, operation, number2) {
    // Parse the numbers as floats
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    // Check if the operation is valid and calculate the result
    let result;
    switch (operation) {
        case OPERATIONS.ADDITION:
            result = num1 + num2;
            break;
        case OPERATIONS.SUBTRACTION:
            result = num1 - num2;
            break;
        case OPERATIONS.MULTIPLICATION:
            result = num1 * num2;
            break;
        case OPERATIONS.DIVISION:
            if (num2 === 0 || num1 % num2 !== 0) {
                // Division by zero or with remainder is not allowed
                result = null;
            } else {
                result = num1 / num2;
            }
            break;
        default:
            // Invalid operation
            result = null;
            break;
    }

    // Check if the result is valid
    if (result !== null && result >= 1 && result <= 999 && Number.isInteger(result)) {
        return result;
    } else {
        return null;
    }
}

function handleClick(event) {
    const click = event.target;
    const isNumber = click.classList.contains('number');
    const isOperation = click.classList.contains('operation');
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetGame);

    if (isNumber) {
        const selected1 = document.querySelector('.selected1');
        const selected2 = document.querySelector('.selected2');
        const selectedOperation = document.querySelector('.selectedOperation');

        if (selected1 && !selectedOperation && click !== selected1) {
            // Replace the first selected number
            selected1.classList.remove('selected1');
            click.classList.add('selected1');
        }

        // Add the "selected1" class to the first selected number and "selected2" class to the second
        if (!selected1) {
            click.classList.add('selected1');
        } else if (!selected2 && click !== selected1 && selectedOperation) {
            const result = calculateResult(selected1.textContent, selectedOperation.textContent, click.textContent);
            console.log(`${selected1.textContent} ${selectedOperation.textContent} ${click.textContent} = ${result}`);
            if (result) {
                // Replace the second selected number with the result
                click.textContent = result;

                // Replace the selected1 node with an empty space
                const parent = selected1.parentNode;
                const emptySpace = document.createElement('div');
                emptySpace.classList.add('number');
                parent.replaceChild(emptySpace, selected1);

                // Clear the selected operation
                selectedOperation.classList.remove('selectedOperation');

                // Check if the target number is reached
                if (result === targetNumber) {
                    alert('Congratulations, you win!');
                }
            } else {
                // Invalid operation
                selected1.classList.remove('selected1');
                selectedOperation.classList.remove('selectedOperation');
                alert('Invalid operation, please try again.');
            }
        } else if (selected2) {
            selected2.classList.remove('selected2');
        }
        console.log(click.textContent);
    }

    if (isOperation) {
        const selected1 = document.querySelector('.selected1');
        if (selected1) {
            // Get all operations
            const operations = document.querySelectorAll('.operation');
    
            // Remove the "selectedOperation" class from all operations except the clicked operation
            operations.forEach(operation => {
                if (operation !== click) {
                    operation.classList.remove('selectedOperation');
                }
            });
    
            // Toggle the "selectedOperation" class on the clicked operation
            click.classList.toggle('selectedOperation');
            console.log(click.textContent);
        } else {
            // No number is selected yet, cannot select an operation
            //alert('Please select a number first.');
        }
    }
}
  
// Run it

window.addEventListener("load", () => {
    generateTargetNumber();
    generateNumberGrid();
    document.querySelectorAll('.operation').forEach(button => {
        button.addEventListener('click', handleClick);
      });
});
