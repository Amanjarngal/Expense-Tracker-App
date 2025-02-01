import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/themeContext";
import {
  Container,
  Card,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { DarkMode, LightMode, Delete, Edit, Logout } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_URL = "http://localhost:8800/api/v1";

const Home = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [chartData, setChartData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [editExpense, setEditExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    id: "",
  });
  const categories = ["Food", "Travel", "Entertainment", "Utilities", "Health", "Education", "Other"];

  useEffect(() => {
    fetchTransactions();
    fetchMetrics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/expense/view`, getAuthHeaders());
      setTransactions(response.data.expenses || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/expense/metrics`, getAuthHeaders());
      setChartData(response.data.spending || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch spending metrics");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/user/logout`, {}, getAuthHeaders());
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewExpense({
      amount: "",
      category: "",
      date: "",
      description: "",
    });
  };

  const handleOpenEditDialog = (expense) => {
    setEditExpense({
      ...expense,
      date: expense.date.split("T")[0], // format date to match input type
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditExpense({
      amount: "",
      category: "",
      date: "",
      description: "",
      id: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateExpense = async () => {
    if (!newExpense.amount || !newExpense.date || !newExpense.category) {
      toast.error("Amount, Category, and Date are required.");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/expense/add`, newExpense, getAuthHeaders());
      toast.success("Expense added successfully!");
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleEditExpense = async () => {
    try {
      await axios.put(`${API_URL}/expense/update/${editExpense.id}`, editExpense, getAuthHeaders());
      toast.success("Expense updated successfully!");
      fetchTransactions();
      handleCloseEditDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expense/delete/${id}`, getAuthHeaders());
      toast.success("Expense deleted successfully!");
      fetchTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <IconButton onClick={toggleTheme}>{mode === "dark" ? <LightMode /> : <DarkMode />}</IconButton>
        <IconButton onClick={handleLogout}><Logout /></IconButton>
      </Box>

      <Card>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total Spending" fill="#8884d8" />
            </BarChart>
          </Grid>
        </Grid>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="contained" onClick={handleOpenDialog}>New Expense</Button>
      </Box>

      <Card>
        <Typography variant="h6">Recent Transactions</Typography>

        {currentItems.map((transaction) => (
          <Box key={transaction._id} p={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={3}><Typography>{transaction.title}</Typography></Grid>
              <Grid item xs={2}><Typography>₹{transaction.amount}</Typography></Grid>
              <Grid item xs={2}><Typography>{transaction.category}</Typography></Grid>
              <Grid item xs={3}><Typography>{new Date(transaction.date).toLocaleDateString()}</Typography></Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleOpenEditDialog(transaction)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteExpense(transaction._id)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={Math.ceil(transactions.length / itemsPerPage)} page={currentPage} onChange={(_, value) => setCurrentPage(value)} />
        </Box>
      </Card>

      {/* Dialog for New Expense */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Category"
            select
            fullWidth
            required
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateExpense} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Expense */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            name="amount"
            value={editExpense.amount}
            onChange={handleEditInputChange}
            margin="normal"
          />
          <TextField
            label="Category"
            select
            fullWidth
            required
            name="category"
            value={editExpense.category}
            onChange={handleEditInputChange}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            name="date"
            value={editExpense.date}
            onChange={handleEditInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={editExpense.description}
            onChange={handleEditInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditExpense} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default Home;
