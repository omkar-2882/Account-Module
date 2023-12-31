import axios from "axios";
import React, { useEffect, useState } from "react";
import PrintReceipt from "./PrintReceipt";
import { renderToString } from "react-dom/server";

const GenerateReceipt = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState("");

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Fetch transaction records from the database
    // Replace the following code with your actual database fetch logic
    fetchAllReceipts();
  };

  const handlePrint = (receiptNo) => {
    // Find the transaction based on receiptNo
    const transaction = transactions.find(
      (transaction) => transaction.receiptNo === receiptNo
    );
    if (transaction) {
      // Create a new window and write the content to be printed
      const printWindow = window.open("", "_blank");
      printWindow.document.write(renderToString(<PrintReceipt transaction={transaction} />));
      // Call the print method on the print window
      printWindow.print();
      // Close the print window after printing is done
      printWindow.close();
    }
  };

  const handleReportSelection = (event) => {
    setSelectedReport(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return transaction.receiptNo.toString().includes(searchQuery);
  });

  const fetchAllReceipts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/fetchReceipts");
      const data = response.data;
      if (!data.found) {
        console.log(data.error);
      } else {
        setTransactions(data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllReceipts();
  }, []);

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h2>Generate Fee Receipt</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="number"
              placeholder="Search by Receipt No"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              style={styles.input}
            />
          </div>
        </form>
        {filteredTransactions.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableCell}>Receipt No</th>
                  <th style={styles.tableCell}>Name</th>
                  <th style={styles.tableCell}>Branch</th>
                  <th style={styles.tableCell}>Academic Year</th>
                  <th style={styles.tableCell}>Phone Number</th>
                  <th style={styles.tableCell}>Print</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={styles.tableCell}>{transaction.receiptNo}</td>
                    <td style={styles.tableCell}>{transaction.name}</td>
                    <td style={styles.tableCell}>{transaction.branch}</td>
                    <td style={styles.tableCell}>{transaction.academicYear}</td>
                    <td style={styles.tableCell}>{transaction.phone}</td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.submitButton}
                        onClick={() => handlePrint(transaction.receiptNo)}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
        <div style={styles.formContainer}>
          <label htmlFor="report">Select Report:</label>
          <select
            id="report"
            value={selectedReport}
            onChange={handleReportSelection}
            style={{
              ...styles.input,
              backgroundImage: "none",
              marginLeft: "30px",
              paddingLeft: "7px",
            }} // Remove the search icon
          >
            <option value="" disabled hidden>
              Select Report
            </option>
            <option value="dailyTransaction">Daily Transaction report</option>
            <option value="balanceFee">Balance Fee report</option>
            <option value="admission">Admission report</option>
            <option value="installmentWise">Installment wise report</option>
            <option value="monthlyTransaction">
              Monthly Transaction report
            </option>
            <option value="yearlyTransaction">Yearly Transaction report</option>
            <option value="individualTransaction">
              Individual Transaction report of students
            </option>
            <option value="feeHeadwise">Fee headwise Transaction report</option>
            <option value="branchWise">Branch wise Transaction report</option>
            <option value="categoryWise">
              Category Wise Transaction report
            </option>
          </select>
        </div>
        <div style={{ ...styles.formContainer, paddingTop: "20px" }}>
          {/* Add padding */}
          <button
            style={{ ...styles.submitButton, width: "150px" }}
            disabled={!selectedReport}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReceipt;

const styles = {
  mainContent: {},
  formContainer: {
    padding: "20px",
    borderRadius: "4px",
    display: "inline-block",
    width: "100%",
  },
  form: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  inputGroup: {
    fontWeight: "bold",
    alignItems: "center",
  },
  input: {
    flex: "0 0 60px",
    padding: "10px 35px 10px 10px",
    paddingLeft: "45px",
    border: "1px solid #ccc",
    transition: "border-color 0.3s ease",
    backgroundImage: "url(/search_icon.png)",
    backgroundPosition: "left 10px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "20px",
    borderRadius: "4px",
    borderColor: "#4d4d4d",
  },
  tableContainer: {
    maxHeight: "400px",
    border: "0.5px solid #e6e6e6",
    maxWidth: "100%",
    background: "white",
    borderRadius: "4px",
    overflow: "hidden",
    margin: "10px 0",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  tableCell: {
    border: "1px solid #e6e6e6",
    padding: "8px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#00b695",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "20px",
    width: "100%",
  },
};

