document.addEventListener('DOMContentLoaded', () => {
    const toggleThemeCheckbox = document.getElementById('toggle-theme');
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '';
    const operators = ['+', '-', '×', '÷'];
    const themes = {
        light: 'light',
        dark: 'dark',
    };

    //Update screen
    function updateDisplay(value) {
        display.value = value;
    }

    //Evaluate the mathematical expression
    function evaluateExpression(expression) {
        try {
            let formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/--/g, '+');
            return new Function('return ' + formattedExpression)().toString();
        } catch {
            return 'Error';
        }
    }

    //Handle calculator input
    function handleInput(value) {
        const lastChar = currentInput.slice(-1);
        const secondLastChar = currentInput.slice(-2, -1);

        if (value === 'C') {
            currentInput = '';
            updateDisplay('');
            return;
        }

        if (value === '←') {
            if (['Error', 'NaN', 'Infinity'].includes(display.value)) {
                currentInput = '';
                updateDisplay('');
                return;
            }
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput);
            return;
        }

        if (value === '=') {
            if (['Error', 'NaN', 'Infinity'].includes(display.value) || currentInput === '') {
                currentInput = '';
                updateDisplay('');
                return;
            }
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
            } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value === '-' && currentInput.length > 1) {
                currentInput += value;
            } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value !== '-' && currentInput.length > 1) {
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

    //Add events to buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button.textContent);
        });
    });

    //Handle keyboard input
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

    //Manage theme status 
    function applyTheme(theme) {
        document.body.classList.remove(themes.light, themes.dark);
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }

    let savedTheme = localStorage.getItem('theme') || themes.light;
    applyTheme(savedTheme);
    toggleThemeCheckbox.checked = savedTheme === themes.dark;

    toggleThemeCheckbox.addEventListener('change', (event) => {
        const newTheme = event.target.checked ? themes.dark : themes.light;
        applyTheme(newTheme);
    });
});
