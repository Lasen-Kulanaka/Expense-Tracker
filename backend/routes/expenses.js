const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require a valid token
router.use(authMiddleware);

// CREATE an expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Amount, category, and date are required' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      note,
      date
    });

    res.status(201).json(expense);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating expense' });
  }
});

// READ all expenses for the logged-in user
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// UPDATE an expense
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      expense.amount = amount;
    }
    if (category !== undefined) expense.category = category;
    if (note !== undefined) expense.note = note;
    if (date !== undefined) expense.date = date;

    await expense.save();
    res.json(expense);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
});

// SUMMARY: total this month + spending by category
router.get('/summary/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyExpenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalThisMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const allExpenses = await Expense.find({ userId: req.userId });
    const byCategory = {};
    allExpenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    res.json({ totalThisMonth, byCategory });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while calculating summary' });
  }
});

module.exports = router;