function loadExpenses() {
    fetch('http://localhost:5165/api/expense')
        .then(response => response.json())
        .then(data => {
            const expenseHistory = document.getElementById('expense-history');
            expenseHistory.innerHTML = ''; 
            if (Array.isArray(data)) {
                data.forEach(expense => addExpenseToTable(expense));
                updateExpenses(data); 
            } else {
                console.error('Otrzymane dane nie są tablicą.');
            }
        })
        .catch(error => {
            console.error('Błąd przy pobieraniu danych:', error);
        });
}

function updateExpenses(expenses) {
    console.log('Aktualizacja podsumowania z danymi:', expenses); 
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2) + ' PLN';
}

function addExpenseToTable(expense) {
    const expenseHistory = document.getElementById('expense-history');
    const newRow = expenseHistory.insertRow();

    newRow.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.amount.toFixed(2)} PLN</td>
        <td>${new Date(expense.date).toISOString().split('T')[0]}</td>
        <td>${expense.category}</td>
        <td><button class="delete-btn" data-id="${expense.id}">Usuń</button></td>
    `;
    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        deleteExpense(expense.id, newRow);
    });
}

function deleteExpense(expenseId, row) {
    fetch(`http://localhost:5165/api/expense/${expenseId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            row.remove();
            loadExpenses(); 
        } else {
            console.error('Błąd przy usuwaniu wydatku:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Błąd:', error);
    });
}

document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    const expenseData = { description, amount, date, category };

    fetch('http://localhost:5165/api/expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    })
    .then(response => response.json())
    .then(data => {
        addExpenseToTable(data);
        document.getElementById('expense-form').reset();
        loadExpenses(); 
    })
    .catch(error => {
        console.error('Błąd:', error);
    });
});

window.addEventListener('load', loadExpenses);
