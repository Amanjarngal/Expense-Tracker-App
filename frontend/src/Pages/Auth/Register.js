import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
import './auth.css'; // Import custom CSS

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
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
    theme: "dark",
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

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
    <div className="lining-background">
      <Container className="mt-12" style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col md={6} className="mb-4"> {/* Increased column size */}
            <Card className="login-card mt-4" style={{ maxWidth: '500px', margin: '0 auto' }}> {/* Added mt-4 for top margin */}
              <Card.Body>
                <h1 className="text-center">
                  <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "black" }} />
                </h1>
                <h2 className="text-dark text-center">Welcome to Expense Management System</h2>
                <h2 className="text-dark text-center mt-5">Registration</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicName" className="mt-3">
                    <Form.Label className="text-dark">Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Full name" value={values.name} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail" className="mt-3">
                    <Form.Label className="text-dark">Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" value={values.email} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label className="text-dark">Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} />
                  </Form.Group>
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} className="mt-4">
                    <Link to="/forgotPassword" className="text-dark lnk">Forgot Password?</Link>
                    <Button
                      type="submit"
                      className="text-center mt-3 btnStyle"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Signup"}
                    </Button>
                    <p className="mt-3" style={{ color: "#9d9494" }}>Already have an account? <Link to="/login" className="text-dark lnk">Login</Link></p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default Register;