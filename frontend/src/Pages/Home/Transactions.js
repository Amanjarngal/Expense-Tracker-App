import React, { useState } from "react";
import ActionBox from "./ActionBox";
import ModelForm from "./ModelForm";
import { editTransactions } from "../../utils/ApiRequest";

const Transactions = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await editTransactions(id, updatedData);
      alert("Transaction updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction._id} className="transaction-item">
          <span>{transaction.title} - ₹{transaction.amount}</span>
          <ActionBox transaction={transaction} onEdit={handleEdit} />
        </div>
      ))}

      {isModalOpen && (
        <ModelForm
          transaction={selectedTransaction}
          isShow={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Transactions;
