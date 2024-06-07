document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    let currentInput = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            const operators = ['+', '-', '*', '/'];
            const lastChar = currentInput.length > 0 ? currentInput[currentInput.length - 1] : '';
            const secondLastChar = currentInput.length > 1 ? currentInput[currentInput.length - 2] : '';

            if (value === 'C') {
                currentInput = '';
                display.value = '';
                return;
            }

            if (value === 'supr') {                
                currentInput = currentInput.slice(0, -1);
                display.value = currentInput;
                return;
            }

            if (value === '=') {
                try {
                    let expression = currentInput.replace(/--/g, '+');
                    currentInput = eval(expression).toString();
                    display.value = currentInput;
                } catch {
                    display.value = 'Error';
                }
                return;
            }

            if (operators.includes(value)) {
                if (!operators.includes(lastChar)) {
                    currentInput += value;
                } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value === '-') {
                    currentInput += value;
                } else if (operators.includes(lastChar) && !operators.includes(secondLastChar) && value !== '-') {
                    currentInput = currentInput.slice(0, -1) + value;
                }
            } else {
                currentInput += value;
            }

            display.value = currentInput;
        });
    });
});
