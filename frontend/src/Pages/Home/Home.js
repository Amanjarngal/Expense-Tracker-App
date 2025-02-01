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
              <Bar dataKey="totalSpending" fill="#8884d8" />
            </BarChart>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Typography variant="h6">Recent Transactions</Typography>

        {currentItems.map((transaction) => (
          <Box key={transaction._id} p={2}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={3}><Typography>{transaction.title}</Typography></Grid>
              <Grid item xs={2}><Typography>₹{transaction.amount}</Typography></Grid>
              <Grid item xs={2}><Typography>{transaction.category}</Typography></Grid>
              <Grid item xs={3}><Typography>{new Date(transaction.date).toLocaleDateString()}</Typography></Grid>
            </Grid>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={Math.ceil(transactions.length / itemsPerPage)} page={currentPage} onChange={(_, value) => setCurrentPage(value)} />
        </Box>
      </Card>

      <ToastContainer />
    </Container>
  );
};

export default Home;
