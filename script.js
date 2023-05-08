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
let operationsHistory = [];
let gridHistory = [];

// Functions
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTargetNumber() {
    const min = 50;
    const max = 500;
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
    originalNumbers.sort((a, b) => a - b); // Sort the array low to high
    const numberDivs = document.querySelectorAll(".number");
    numberDivs.forEach((div, index) => {
        div.textContent = originalNumbers[index];
        div.addEventListener("click", handleClick);
    });
}

function undoOperation() {
    if (gridHistory.length > 0) {
        // Get the previous grid state
        const previousGridState = gridHistory[gridHistory.length - 1];

        // Update the numbers in the grid
        const numberDivs = document.querySelectorAll(".number");
        numberDivs.forEach((div, index) => {
            div.textContent = previousGridState[index];
            div.addEventListener('click', handleClick);
        });
    }

    // Remove the most recent grid state from the history
    gridHistory.pop();
    operationsHistory.pop();
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
    if (result !== null && result >= 1 && result <= 9999 && Number.isInteger(result)) {
        // Push the performed operation to the operationsHistory array
        operationsHistory.push(`${number1} ${operation} ${number2} = ${result}`);
        // Save the current state of the grid before the operation
        const prevGridState = [];
        document.querySelectorAll('.number').forEach(number => prevGridState.push(number.innerHTML));

        // Push the previous state to gridHistory
        gridHistory.push(prevGridState);
        console.log('grid hist: ', gridHistory)
        console.log('op hist: ', operationsHistory)
        return result;
    } else {
        return null;
    }
}


function handleClick(event) {
    const click = event.target;
    const isNumber = click.classList.contains('number');
    const isOperation = click.classList.contains('operation');
    document.getElementById('undo').addEventListener('click', undoOperation);

    if (isNumber) {
        console.log('num clicked: ', click.textContent);
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
            //console.log(`${selected1.textContent} ${selectedOperation.textContent} ${click.textContent} = ${result}`);
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
                    // Select the h1 element
                    const h1Element = document.querySelector('h1');
                    // Change its text content
                    h1Element.textContent = 'You win! Refresh to play again';
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
            console.log('selected op: ', click.textContent);
        } else {
            // No number is selected yet, cannot select an operation
            //alert('Please select a number first.');
        }
    }

    // const revealButton = document.querySelector("#reveal");

    // revealButton.addEventListener("click", () => {
    //     console.log('reveal');
    //     const solution = calculatePath(originalNumbers, targetNumber);
    //     if (solution) {
    //         const messageDiv = document.querySelector("#message");
    //         messageDiv.textContent = `Solution: ${solution.join(" ")}`;
    //     }
    // });

}

// Run it

function printOperationsHistory() {
    // Select the message div
    const messageDiv = document.querySelector('#message');
  
    // Clear existing content of message div
    messageDiv.innerHTML = '';
  
    // Loop through the operations history and add each operation as a separate <p> element
    operationsHistory.forEach((operation) => {
      const pElement = document.createElement('p');
      pElement.textContent = operation;
      messageDiv.appendChild(pElement);
    });
  }
  
  

window.addEventListener("load", () => {
    generateTargetNumber();
    generateNumberGrid();
    printOperationsHistory();
    document.querySelectorAll('.operation').forEach(button => {
        button.addEventListener('click', handleClick);
    });
});
