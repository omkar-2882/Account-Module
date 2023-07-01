import React, { useEffect, useState } from "react";
import ReceiptTemplate from "./ReceiptTemplate";
import axios from "axios";
import "./CollectFee.css";

const CollectFee = () => {
  const [student, setStudent] = useState({});
  const [receiptNo, setReceiptNo] = useState(0);
  const [date, setDate] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeYear, setCollegeYear] = useState("");
  const [category, setCategory] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [tableData, setTableData] = useState([
    { feeHead: "", amount: "" },
    // { feeHead: "", amount: "" },
    // { feeHead: "", amount: "" },
    // { feeHead: "", amount: "" },
  ]);
  const [feeHead, setFeeHead] = useState("");
  const [amount, setAmount] = useState("");
  const [studentId, setStudentId] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [allFee, setallFee] = useState([]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!feeHead || !amount) {
      alert("Please fill in all the fields.");
      return;
    }

    const updatedTableData = [...tableData];

    let updated = false;

    for (let i = 0; i < updatedTableData.length; i++) {
      const row = updatedTableData[i];
      if (!row.feeHead || !row.amount) {
        row.feeHead = feeHead;
        row.amount = amount;
        updated = true;
        break;
      }
    }

    if (!updated) {
      const newRow = {
        feeHead: feeHead,
        amount: amount,
      };
      updatedTableData.push(newRow);
    }

    setTableData(updatedTableData);
    setFeeHead("");
    setAmount("");
  };

  const handleIdChange = (e) => {
    setStudentId(e.target.value);
  };

  // const handleNameChange = (e) => {
  //   const value = e.target.value.replace(/[0-9]/g, "");
  //   setName(value);
  // };

  // const handleBranchChange = (e) => {
  //   const value = e.target.value.replace(/[0-9]/g, "");
  //   setBranch(value);
  // };

  const handleBankNameChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, "");
    setBankName(value);
  };

  const handleBankBranchChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, "");
    setBankBranch(value);
  };

  const handleDelete = () => {
    const maxRowIndex = 4; // Define the maximum index of the rows to keep
    if (tableData.length <= maxRowIndex) {
      // If the number of rows is less than or equal to the maximum index
      const updatedTableData = [...tableData]; // Create a copy of the tableData array
      updatedTableData.pop(); // Remove the last row from the copy
      setTableData(updatedTableData); // Update the state with the modified array
    }
  };

  const addData = async (fh, amt) => {
    try {
      // const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `http://localhost:4000/collect-fee`,
        {
          receiptNo: receiptNo,
          date: date,
          academicYear: academicYear,
          name: name,
          branch: branch,
          phone: student.telephone,
          collegeYear: collegeYear,
          bankName: bankName,
          bankBranch: bankBranch,
          chequeDate: chequeDate,
          chequeNo: chequeNo,
          fee_head: fh,
          amount: amt,
          studentId: studentId,
        }
        // config
      );
      if (data.success === true) {
        console.log("Data Saved successfully");
      } else {
        console.log(data.err);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FetchStudent = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/fetchStudent`, {
        sid: parseInt(studentId),
      });
      const data = await response.data;
      if (!data.found) {
        console.log(data.error);
        return {};
      } else {
        return data.result;
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const fetchAllReceipts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/fetchReceipts");
      const data = await response.data;
      if (!data.found) {
        console.log(data.error);
        return [];
      } else {
        return data.result;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const FetchStudentAndSave = async () => {
    const result = await FetchStudent();
    if (Object.keys(result).length) {
      // console.log(result);
      setStudent(result);
      setName(result.name);
      setBranch(result.branch);
      setCollegeYear(result.collegeYear);
      setCategory(result.category);
      const latestReceipt = await fetchLatestReceipt();
      setReceiptNo(latestReceipt+1);
    } else {
      alert("Student Not Found!");
      setStudent({});
    }
  };

  const fetchLatestReceipt = async () => {
    const result = await fetchAllReceipts();
    if (result.length>0) {
      const sortedTransactions = await result.sort(
        (a, b) => b.receiptNo - a.receiptNo
      );
      return (sortedTransactions[0].receiptNo);
    } 
    else {
      alert("Receipt Not Found!");
      return 0;
    }
  };
  const handlePrint = () => {
    if (
      !receiptNo ||
      !date ||
      !academicYear ||
      !name ||
      !branch ||
      !collegeYear ||
      !bankName ||
      !bankBranch ||
      !chequeDate ||
      !chequeNo
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    if (tableData.length === 0) {
      alert("Please add at least one fee head.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            /* Add custom CSS styles for printing if needed */
          </style>
        </head>
        <body>
          ${getPrintableContent()}
        </body>
      </html>
    `);

    tableData.map(async ({ feeHead, amount })=>{
      addData(feeHead, amount)
    })

    printWindow.document.close();
    printWindow.print();

  };

  const getPrintableContent = () => {
    return `
      <div>
        <h1>Receipt</h1>
        <p>Receipt No: ${receiptNo}</p>
        <p>Date: ${date}</p>
        <p>Academic Year: ${academicYear}</p>
        <p>Name: ${name}</p>
        <p>Branch: ${branch}</p>
        <p>College Year: ${collegeYear}</p>
        <p>Bank Name: ${bankName}</p>
        <p>Bank Branch: ${bankBranch}</p>
        <p>Cheque Date: ${chequeDate}</p>
        <p>Cheque No: ${chequeNo}</p>
        
        <table>
          <thead>
            <tr>
              <th>Fee Head</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tableData
              .map(({ feeHead, amount }) => {
                return `
                  <tr>
                    <td>${feeHead}</td>
                    <td>${amount}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  const FetchAllFh = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/fetchAllFh`);
      if (!data.found) console.log(data.error);
      else {
        setallFee(data.result, ...allFee);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    FetchAllFh();
  }, []);

  return (
    <div style={styles.mainContent}>
      <div style={styles.formContainer}>
        <h1> COLLECT STUDENT FEE </h1>

        <div style={styles.gridContainer}>
          <div style={styles.inputGroup}>
            <h2>Basic Details</h2>
            <div style={styles.inputBox}>
              <div style={styles.gridInputContainer}>
                <div style={styles.label}>
                  <label htmlFor="studentId">Student ID:</label>
                </div>
                <div id="sid" style={styles.inputGroup}>
                  <input
                    type="number"
                    id="studentId"
                    value={studentId}
                    onChange={(e) => {
                      handleIdChange(e);
                    }}
                    style={styles.input}
                  />
                  <i
                    onClick={FetchStudentAndSave}
                    className="fa-solid fa-magnifying-glass"
                  ></i>
                </div>
                <div style={styles.label}>
                  <label htmlFor="receiptNo">Receipt No:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    id="receiptNo"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(parseInt(e.target.value))}
                    style={styles.input}
                  />
                </div>

                <div style={styles.label}>
                  <label htmlFor="date">Date:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="academicYear">Academic Year:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    id="academicYear"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(parseInt(e.target.value))}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <h2>Student Details </h2>
            <div style={styles.inputBox}>
              <div style={styles.gridInputContainer}>
                <div style={styles.label}>
                  <label htmlFor="name">Name:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    value={Object.keys(student).length > 0 ? student.name : ""}
                    // onChange={handleNameChange}
                    readOnly
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="branch">Branch:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    id="branch"
                    value={
                      Object.keys(student).length > 0 ? student.branch : ""
                    }
                    // onChange={handleBranchChange}
                    readOnly
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="collegeYear">College Year:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    id="collegeYear"
                    value={Object.keys(student).length > 0 ? student.collegeYear : ""}
                    // onChange={(e) => setCollegeYear(parseInt(e.target.value))}
                    readOnly
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="category">Category:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    id="category"
                    value={Object.keys(student).length > 0 ? student.category : ""}
                    // onChange={(e) => setCollegeYear(parseInt(e.target.value))}
                    readOnly
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <h2>Bank Details </h2>
            <div style={styles.inputBox}>
              <div style={styles.gridInputContainer}>
                <div style={styles.label}>
                  <label htmlFor="bankName">Bank Name:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    id="bankName"
                    value={bankName}
                    onChange={handleBankNameChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="bankBranch">Bank Branch:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    id="bankBranch"
                    value={bankBranch}
                    onChange={handleBankBranchChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="chequeDate">Cheque Date:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="date"
                    id="chequeDate"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="chequeNo">Cheque No:</label>
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    id="chequeNo"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(parseInt(e.target.value))}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
            <div style={styles.inputBox}>
              <div style={{ ...styles.gridInputContainer, height: "210px" }}>
                <div style={{}}>
                  {tableData.length > 0 && (
                    <div style={styles.tableContainer}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th
                              style={{
                                ...styles.tableCell,
                                background: "#f6f6f6",
                                textAlign: "left",
                              }}
                            >
                              Description
                            </th>
                            <th
                              style={{
                                ...styles.tableCell,
                                background: "#f6f6f6",
                                textAlign: "left",
                              }}
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((data, index) => (
                            <tr key={index}>
                              <td style={styles.tableCell}>{data.feeHead}</td>
                              <td style={styles.tableCell}>{data.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div style={styles.inputGroup}>
                    <label htmlFor="feeHead">Fee Head:</label>
                    {/* <input
                      type="text"
                      id="feeHead"
                      value={feeHead}
                      placeholder="Development Fees"
                      onChange={(e) => setFeeHead(e.target.value)}
                      style={{ ...styles.input, width: "225px" }}
                    /> */}

                    <select
                      id="feeHead"
                      value={feeHead}
                      onChange={(e) => setFeeHead(e.target.value)}
                      style={{ ...styles.input, width: "225px" }}
                    >
                      <option value="" disabled hidden>
                        Select Fee Head
                      </option>
                      {allFee.length > 0 &&
                        allFee.map((fee) => {
                          return (
                            <option key={fee.fh_id} value={fee.name}>
                              {fee.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div style={styles.buttonContainer}>
                    <button
                      type="submit"
                      style={{
                        ...styles.submitButton,
                        backgroundColor: "#e6e6e6",
                        color: "black",
                      }}
                    >
                      Add Line
                    </button>
                    <button
                      type="button"
                      style={{
                        ...styles.submitButton,
                        backgroundColor: "#e6e6e6",
                        color: "black",
                      }}
                      onClick={handleDelete}
                    >
                      Delete Line
                    </button>
                  </div>
                  <label htmlFor="amount">Amount:</label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    placeholder="12345"
                    onChange={(e) => setAmount(e.target.value)}
                    style={styles.input}
                  />
                  <div style={styles.buttonContainer}>
                    <button
                      type="submit"
                      style={styles.submitButton}
                      onClick={handlePrint}
                    >
                      Print Receipt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectFee;

const styles = {
  mainContent: {
    flex: 1,
    padding: "20px",
  },

  form: {
    marginTop: "20px",
  },

  formContainer: {
    padding: "0px 20px 0px 0px",
    borderRadius: "4px",
    display: "inline-block",
    width: "100%",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridGap: "10px",
    paddingTop: " 20px",
  },

  gridInputContainer: {
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr",
    alignItems: "center",
    height: "150px",
  },

  inputGroup: {
    fontWeight: "bold",
    alignItems: "center",
  },

  inputBox: {
    backgroundColor: "#f6f6f6",
    padding: "20px",
    borderRadius: "10px",
  },

  label: {
    width: "120px",
  },
  input: {
    flex: "0 0 60px",
    border: "1px solid #ccc",
    transition: "border-color 0.3s ease",
    borderRadius: "4px",
    borderColor: "#4d4d4d",
    padding: "5px",
    margin: "5px 5px 5px 5px",
    borderColor: "#4d4d4d",
  },
  buttonContainer: {
    display: "flex",
    margin: "20px 0px 20px 0px",
    display: "flex",
    justifyContent: "center",
  },
  submitButton: {
    padding: "10px 35px",
    backgroundColor: "#00b695",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "20px",
  },

  tableContainer: {
    maxHeight: "400px",
    border: "5px solid #f6f6f6",
    maxWidth: "90%",
    background: "white",
    borderRadius: "4px",
    overflow: "hidden", // Increase the margin to create a bigger cell gap
  },

  table: {
    borderCollapse: "collapse",
    width: "100%",
  },

  tableCell: {
    border: "5px solid #f6f6f6",
    padding: "8px",
    height: "40px", // Adjust the height as needed
    verticalAlign: "middle",
  },
};
