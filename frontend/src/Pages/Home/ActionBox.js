import React from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { editTransactions, deleteTransaction } from "../../utils/ApiRequest";

const ActionBox = ({ transaction, onEdit }) => {
  
  const handleEditClick = () => {
    onEdit(transaction); // Pass transaction details to the parent component
  };

  const handleDeleteClick = async () => {
    try {
      await deleteTransaction(transaction._id); // Assuming you have a delete API function
      alert("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="icons-handle">
      <EditNoteIcon sx={{ cursor: "pointer" }} onClick={handleEditClick} />
      <DeleteForeverIcon
        sx={{ color: "red", cursor: "pointer" }}
        onClick={handleDeleteClick}
      />
    </div>
  );
};

export default ActionBox;
