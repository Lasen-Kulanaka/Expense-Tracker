const API_URL = 'http://localhost:5000/api/expenses';
const token = localStorage.getItem('token');

// Protect this page — redirect to login if not authenticated
if (!token) {
  window.location.href = 'login.html';
}

const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.getElementById('expenseTableBody');
const formError = document.getElementById('formError');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const expenseIdField = document.getElementById('expenseId');
const logoutBtn = document.getElementById('logoutBtn');

// Common headers for authenticated requests
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
});

// Load everything when page opens
loadExpenses();
loadSummary();

// ---------- Load and display expenses ----------
async function loadExpenses() {
  try {
    const res = await fetch(API_URL, { headers: authHeaders() });

    if (res.status === 401) {
      // token invalid/expired
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    const expenses = await res.json();
    renderExpenses(expenses);

  } catch (err) {
    console.error(err);
    expenseTableBody.innerHTML = '<tr><td colspan="5">Could not load expenses</td></tr>';
  }
}

function renderExpenses(expenses) {
  if (expenses.length === 0) {
    expenseTableBody.innerHTML = '<tr><td colspan="5">No expenses yet</td></tr>';
    return;
  }

  expenseTableBody.innerHTML = expenses.map(exp => `
    <tr>
      <td>${new Date(exp.date).toLocaleDateString()}</td>
      <td>${exp.category}</td>
      <td>${exp.note || '-'}</td>
      <td>Rs. ${exp.amount.toFixed(2)}</td>
      <td>
        <button class="action-btn edit-btn" onclick="startEdit('${exp._id}', ${exp.amount}, '${exp.category}', '${exp.note || ''}', '${exp.date.split('T')[0]}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteExpense('${exp._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ---------- Load summary ----------
async function loadSummary() {
  try {
    const res = await fetch(`${API_URL}/summary/stats`, { headers: authHeaders() });
    const data = await res.json();

    document.getElementById('totalThisMonth').textContent = `Rs. ${data.totalThisMonth.toFixed(2)}`;

    const breakdown = document.getElementById('categoryBreakdown');
    const categories = Object.entries(data.byCategory);

    if (categories.length === 0) {
      breakdown.innerHTML = '<p>No spending data yet</p>';
    } else {
      breakdown.innerHTML = categories.map(([cat, amt]) =>
        `<p>${cat}: Rs. ${amt.toFixed(2)}</p>`
      ).join('');
    }

  } catch (err) {
    console.error(err);
  }
}

// ---------- Add or Update expense ----------
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const id = expenseIdField.value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const note = document.getElementById('note').value;
  const date = document.getElementById('date').value;

  const body = JSON.stringify({ amount, category, note, date });

  try {
    let res;
    if (id) {
      // Editing existing expense
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body
      });
    } else {
      // Creating new expense
      res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body
      });
    }

    const data = await res.json();

    if (!res.ok) {
      formError.textContent = data.message || 'Something went wrong';
      return;
    }

    resetForm();
    loadExpenses();
    loadSummary();

  } catch (err) {
    console.error(err);
    formError.textContent = 'Could not connect to server';
  }
});

// ---------- Start editing an expense (fills the form) ----------
function startEdit(id, amount, category, note, date) {
  expenseIdField.value = id;
  document.getElementById('amount').value = amount;
  document.getElementById('category').value = category;
  document.getElementById('note').value = note;
  document.getElementById('date').value = date;

  formTitle.textContent = 'Edit Expense';
  submitBtn.textContent = 'Update Expense';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Reset form back to "Add" mode ----------
function resetForm() {
  expenseForm.reset();
  expenseIdField.value = '';
  formTitle.textContent = 'Add Expense';
  submitBtn.textContent = 'Add Expense';
}

// ---------- Delete expense ----------
async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    if (!res.ok) {
      alert('Could not delete expense');
      return;
    }

    loadExpenses();
    loadSummary();

  } catch (err) {
    console.error(err);
    alert('Could not connect to server');
  }
}