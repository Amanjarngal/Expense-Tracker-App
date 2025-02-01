import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const ModelForm = ({ transaction, onClose, isShow, onUpdate }) => {
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  useEffect(() => {
    if (transaction) {
      setValues({
        title: transaction.title || "",
        amount: transaction.amount || "",
        description: transaction.description || "",
        category: transaction.category || "",
        date: transaction.date || "",
        transactionType: transaction.transactionType || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(transaction._id, values); // Call update function
  };

  return (
    <Modal show={isShow} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Transaction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              type="text"
              value={values.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              name="category"
              type="text"
              value={values.category}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Control
              name="transactionType"
              as="select"
              value={values.transactionType}
              onChange={handleChange}
            >
              <option value="credit">Credit</option>
              <option value="expense">Expense</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModelForm;
