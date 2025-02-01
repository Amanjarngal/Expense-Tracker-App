import { useEffect, useState, useContext } from "react";
import { 
  Container, Card, TextField, Button, Typography, CircularProgress, IconButton 
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
import { ThemeContext } from "../../context/themeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: mode, // Dynamic theme
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = values;
    setLoading(true);

    try {
      const { data } = await axios.post(registerAPI, { name, email, password });
      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Card 
        sx={{ 
          p: 4, 
          width: "100%", 
          maxWidth: 450, 
          textAlign: "center", 
          boxShadow: 3, 
          borderRadius: 3,
          bgcolor: mode === "dark" ? "background.paper" : "white",
          color: mode === "dark" ? "text.primary" : "black"
        }}
      >
        <IconButton 
          onClick={toggleTheme} 
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>

        <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome to Expense Manager
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom>
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={values.name}
            onChange={handleChange}
            sx={{
              "& fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&:hover fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&.Mui-focused fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
            }}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={values.email}
            onChange={handleChange}
            sx={{
              "& fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&:hover fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&.Mui-focused fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={values.password}
            onChange={handleChange}
            sx={{
              "& fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&:hover fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
              "&.Mui-focused fieldset": { borderColor: mode === "dark" ? "#555" : "#ccc" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Register;
