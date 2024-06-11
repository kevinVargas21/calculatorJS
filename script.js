document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    let currentInput = '';

    const operators = ['+', '-', '×', '÷'];

    function updateDisplay(value) {
        display.value = value;
    }

    function evaluateExpression(expression) {
        try {
            let formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            return eval(formattedExpression).toString();
        } catch {
            return 'Error';
        }
    }

    function handleInput(value) {
        const lastChar = currentInput.length > 0 ? currentInput[currentInput.length - 1] : '';
        const secondLastChar = currentInput.length > 1 ? currentInput[currentInput.length - 2] : '';

        if (value === 'C') {
            currentInput = '';
            updateDisplay('');
            return;
        }

        if (value === '←') {
            if (display.value === 'Error' || display.value === 'NaN' || display.value === 'Infinity') {
                currentInput = '';
                updateDisplay('');
                return;
            }
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput);
            return;
        }

        if (value === '=') {
            currentInput = evaluateExpression(currentInput);
            updateDisplay(currentInput);
            return;
        }

        if (display.value === 'Error' || display.value === 'NaN' || display.value === 'Infinity') {
            if (operators.includes(value)) {
                currentInput = '';
                updateDisplay('');
                return;
            } else {
                currentInput = value;
            }
        } else if (operators.includes(value)) {
            if (currentInput === '' && value !== '-') {
                return;
            } else if (!operators.includes(lastChar)) {
                currentInput += value;
            } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value === '-') {
                currentInput += value;
            } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value !== '-') {
                currentInput = currentInput.slice(0, -1) + value;
            }
        } else if (value === '.') {
            const lastNumber = currentInput.split(/[\+\-\×\÷]/).pop();
            if (lastNumber === '' || operators.includes(lastChar)) {
                currentInput += '0.';
            } else if (!lastNumber.includes('.')) {
                currentInput += value;
            }
        } else {
            currentInput += value;
        }
        updateDisplay(currentInput);
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button.textContent);
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (!isNaN(key) || key === '.') {
            handleInput(key);
        } else if (key === 'Backspace') {
            handleInput('←');
        } else if (key === 'Enter' || key === '=') {
            handleInput('=');
        } else if (key === 'Escape') {
            handleInput('C');
        } else if (key === '+') {
            handleInput('+');
        } else if (key === '-') {
            handleInput('-');
        } else if (key === '*') {
            handleInput('×');
        } else if (key === '/') {
            handleInput('÷');
        }
    });
});
