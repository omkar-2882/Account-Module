if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const sendToken = require("./utils/jwtToken");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

const con = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "accountsection",
});

app.post("/register", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  con.query(
    `INSERT INTO user (email, password) VALUES (?, ?)`,
    [user.email, user.password],
    (err, result) => {
      if (err) {
        console.error("An error occurred:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        console.log("Registration successful!");
        user.id = result.insertId;
        sendToken(user, 201, res);
        // res.status(200).json(result); // Set the response code to 200 (OK)
      }
      res.end(); // Close the connection
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  con.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        req.setEncoding({ err: err });
      } else {
        if (result.length > 0) {
          sendToken(result[0], 201, res);
        } else {
          res.json({ success: false, message: "WRONG USERNAME OR PASSWORD" });
        }
      }
      res.end(); // Close the connection
    }
  );
});

app.post("/addstudent", (req, res) => {
  const {
    title,
    name,
    telephone,
    email,
    dob,
    pin,
    addr1,
    addr2,
    previous_institute,
    previous_education,
    gradeofmarks,
    yearofadmission,
    yearofpassing,
    current_status,
    category,
    seatType,
    collegeYear,
    branch,
    admittedtoacademicyear,
  } = req.body;

  con.query(
    `INSERT INTO student (title, name, telephone, email, dob, pin, addr1, addr2, previous_institute, previous_education, gradeofmarks, yearofadmission, yearofpassing, current_status, category, seatType, collegeYear, branch, admittedtoacademicyear) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      title,
      name,
      telephone,
      email,
      dob,
      pin,
      addr1,
      addr2,
      previous_institute,
      previous_education,
      gradeofmarks,
      yearofadmission,
      yearofpassing,
      current_status,
      category,
      seatType,
      collegeYear,
      branch,
      admittedtoacademicyear,
    ],
    (err, result) => {
      if (err) {
        console.error("An error occurred:", err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        res.status(200).json({ success: true, result: result }); // Set the response code to 200 (OK)
      }
      res.end(); // Close the connection
    }
  );
});

app.post("/fetchStudent", (req, res) => {
  const { sid } = req.body;

  con.query(
    "SELECT * FROM student WHERE sid=?",
    [sid],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (result.length > 0) {
          res.status(200).json({ found: true, result: result[0] });
        } else {
          res.status(404).json({ found: false, error: "Student not found" });
        }
      }
      res.end();
    }
  );
});

app.post("/collect-fee", (req, res) => {
  const {
    receiptNo,
    date,
    academicYear,
    name,
    branch,
    phone,
    collegeYear,
    bankName,
    bankBranch,
    chequeDate,
    chequeNo,
    fee_head,
    amount,
  } = req.body;
  const query =
    "INSERT INTO fee_collection (receiptNo, date, academicYear, name, branch, phone, collegeYear, bankName, bankBranch, chequeDate, chequeNo, fee_head, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  con.query(
    query,
    [
      receiptNo,
      date,
      academicYear,
      name,
      branch,
      phone,
      collegeYear,
      bankName,
      bankBranch,
      chequeDate,
      chequeNo,
      fee_head,
      amount,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
        res.status(500).json({ success: false, err });
        return;
      } else {
        res.status(200).json({
          success: true,
          message: "Data inserted successfully",
          result: result,
        });
      }
      res.end(); // Close the connection
    }
  );
});

app.get("/fetchReceipts", (req, res) => {
  con.query("SELECT * FROM fee_collection", [], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (result.length > 0) {
        res.status(200).json({ found: true, result: result });
      } else {
        res.status(404).json({ found: false, error: "Receipt not found" });
      }
    }
    res.end();
  });
});

app.post("/addBranch", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO branch (name) VALUES (?)";
  con.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).json({ success: false, err });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "Data inserted successfully",
        result: result,
      });
    }
    res.end(); // Close the connection
  });
});

app.post("/addAcademicYear", (req, res) => {
  const { year } = req.body;
  const query = "INSERT INTO academic_year (year) VALUES (?)";
  con.query(query, [year], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).json({ success: false, err });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "Data inserted successfully",
        result: result,
      });
    }
    res.end(); // Close the connection
  });
});

app.post("/addFeeHead", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO fee_heads (name) VALUES (?)";
  con.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).json({ success: false, err });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "Data inserted successfully",
        result: result,
      });
    }
    res.end(); // Close the connection
  });
});

app.post("/addCategory", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO categories (name) VALUES (?)";
  con.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).json({ success: false, err });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "Data inserted successfully",
        result: result,
      });
    }
    res.end(); // Close the connection
  });
});

app.post("/fetchCatid", (req, res) => {
  const { category } = req.body;
  con.query(
    "SELECT * FROM categories WHERE name = ?",
    [category],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (result.length > 0) {
          res.status(200).json({ found: true, result: result });
        } else {
          res.status(404).json({ found: false, error: "Category not found" });
        }
      }
      res.end();
    }
  );
});

app.post("/fetchFhid", (req, res) => {
  const { feehead } = req.body;
  con.query(
    "SELECT * FROM fee_heads WHERE name = ?",
    [feehead],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (result.length > 0) {
          res.status(200).json({ found: true, result: result });
        } else {
          res.status(404).json({ found: false, error: "Fee head not found" });
        }
      }
    }
  );
});

app.post("/mapcattofeehead", (req, res) => {
  const { cat_name, fh_name, amount } = req.body;

  const query =
    "INSERT INTO cat_fee_association (cat_name, fh_name, amount) VALUES (?,?,?)";
  con.query(query, [cat_name, fh_name, amount], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database:", err);
      res.status(500).json({ success: false, err });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "Data inserted successfully",
        result: result,
      });
    }
    res.end(); // Close the connection
  });
});

app.get("/fetchAllCat", (req, res) => {
  // const { category } = req.body;
  con.query("SELECT * FROM categories", [], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (result.length > 0) {
        res.status(200).json({ found: true, result: result });
      } else {
        res.status(404).json({ found: false, error: "Category not found" });
      }
    }
    res.end();
  });
});

app.get("/fetchAllFh", (req, res) => {
  // const { category } = req.body;
  con.query("SELECT * FROM fee_heads", [], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (result.length > 0) {
        res.status(200).json({ found: true, result: result });
      } else {
        res.status(404).json({ found: false, error: "Category not found" });
      }
    }
    res.end();
  });
});

app.get("/", (req,res) => {
  res.send("h1")
})

// app.use(express.static(path.join(__dirname, "../dashboard/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../dashboard/build/index.html"));
// });

app.listen(port, () => {
  console.log(`running backend server on ${port}`);
});
