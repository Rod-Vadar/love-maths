// wait for the DOM to be ready before running the game
// get the button elements and add event listeners to them

document.addEventListener('DOMContentLoaded', () => {
    let buttons = document.getElementsByTagName('button');

    for (let button of buttons) {
        button.addEventListener('click', function () {
            if (this.getAttribute('data-type') === 'submit') {
                console.log("Pressed button");
                checkAnswer();
            } else {
                let gameType = this.getAttribute('data-type');
                runGame(gameType);
            }
        })
    }
    document.getElementById('answer-box').addEventListener('keydown', function(event){
        if(event.key === 'Enter'){
            checkAnswer();
        }
    })

    runGame('addition');
})

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed
 */
function runGame(gameType) {
    // clear answer box of old value being displayed
    document.getElementById('answer-box').value = '';

    // focus the cursor to the answer box by default so user does not need to use the mouse
    document.getElementById('answer-box').focus();
    // create two random numbers between 1 and 25
    let num1 = Math.floor(Math.random() * 25) + 1;
    let num2 = Math.floor(Math.random() * 25) + 1;
    /* 
    Some people may wonder why we need to add +1 to the random number.
    In the example above we are seeking a random number between 1 and 25.
    The Math.random() function generates a random number between 0 (inclusive) and 1 (exclusive).
    It can be 0.99999999 but never 1.
    Therefore we can not ever get 25 by multiplying the random number by 25 as 25 * 0.99999 is always less than 25
    So we might get something like 24.99888 but we want 25.
    We also floor the value of 24.99888 to 24 to make it a nice whole integer.

    We also might get a very small number like 0.00001 and 25 times that is still going to be close to 0
    Then we are going to floor it to 0 anyway.

    So our output range is limited to 0 to 24 but we need 1 to 25.
    Simply by adding 1 now gives us the range of 1 to 25
    */

    if (gameType === 'addition') {
        displayAdditonQuestion(num1, num2);
    } else if (gameType === 'multiply') {
        displayMultiplyQuestion(num1, num2);
    } else if (gameType === 'subtract') {
        displaySubractQuestion(num1, num2);
    } else if(gameType==='division') {
        displayDivisionQuestion(num1, num2);
    }else {
        alert(`Unknown game type: ${gameType}`);
        throw `Unknown game type: ${gameType}. Aborting!`;
    }
}

/**
 * Checks the user's answer against the first element in the return value array
 * from calculateCorrectAnswer function
 */
function checkAnswer() {
    let userAnswer = parseInt(document.getElementById('answer-box').value);
    let calculatedAnswer = calculateCorrectAnswer();
    let isCorrect = userAnswer === calculatedAnswer[0];
    console.log(isCorrect);

    if (isCorrect) {
        alert('Hey! You got it right!');
        incrementScore();
    } else {
        alert(`You answered ${userAnswer}. Sorry, you got it wrong. The correct answer was ${calculatedAnswer[0]}`);
        incrementWrongAnswer();
    }
    runGame(calculatedAnswer[1]);
}

/**
 * Gets the operands (the numbers) and the operator (plus, minus etc)
 * directly from the dom, and returns the correct answer.
 */
function calculateCorrectAnswer() {
    let operand1 = parseInt(document.getElementById('operand1').innerText);
    let operand2 = parseInt(document.getElementById('operand2').innerText);
    let operator = document.getElementById('operator').innerText;

    if (operator === '+') {
        return [operand1 + operand2, 'addition'];
    } else if (operator === 'x') {
        return [operand1 * operand2, 'multiply'];
    } else if(operator === '-'){
        return [operand1 - operand2, 'subtract'];
    } else if(operator === '÷'){
        return [operand1 / operand2, 'division'];
    }else {
        alert(`Unimplemented operator ${operator}`);
        throw `Unimplemented operator ${operator}, Aborting!`;
    }
}

/**
 * Gets the current score from the dom and increments it by +1
 */
function incrementScore() {
    let oldScore = parseInt(document.getElementById('score').innerText);
    document.getElementById('score').innerText = ++oldScore;
}

/**
 * Gets the current tally of incorrect answers from the dom and increments it by +1
 */
function incrementWrongAnswer() {
    let oldScore = parseInt(document.getElementById('incorrect').innerText);
    document.getElementById('incorrect').innerText = ++oldScore;
}

function displayAdditonQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = '+';
}

function displaySubractQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1 > operand2 ? operand1 : operand2;
    document.getElementById('operand2').textContent = operand1 > operand2 ? operand2 : operand1;
    document.getElementById('operator').textContent = '-';
}

function displayMultiplyQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1;
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = 'x';
}

function displayDivisionQuestion(operand1, operand2) {
    document.getElementById('operand1').textContent = operand1*operand2;
    /* 
    The reason why I multiply operand1*operand2 in the line above is because it ensures that it will always be divisible
    by operand2.  Eg if operand1 = 3 and operand2 = 5 and I multiply them together to give 15, this will always be divisible by 5.

    Where a and b are two integers(whole numbers), then a * b is always divisible by a or b.  9 * 7 = 63
    Therefore 63 divided by 9 = 7.  The answer will always be an integer which is what we want in this project

    It's a bit contrived but it stops awkward divisions like 5/7 happening.  Hope that helps!
    */
    document.getElementById('operand2').textContent = operand2;
    document.getElementById('operator').textContent = '÷';
    // to do the divide symbol hold Alt key and press 246 on the numeric keypad on the right hand side of the keyboard or it won't work
}