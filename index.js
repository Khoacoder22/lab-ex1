const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "khoa", 
    database: "lab5",
    port: 3306
});

// kiểm tra có kết nối database hay không
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
});

// Endpoints 
app.get("/users", (req, res) => {
    db.query("SELECT * FROM User", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/users", (req, res) => {
    const { FullName, Address, RegistrationDate } = req.body;
    db.query(
        "INSERT INTO User (FullName, Address, RegistrationDate) VALUES (?, ?, ?)",
        [FullName, Address, RegistrationDate],
        (err, results) => {
            if (err) throw err;
            res.json({ message: "User added", userId: results.insertId });
        }
    );
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { FullName, Address, RegistrationDate } = req.body;
    db.query(
        "UPDATE User SET FullName = ?, Address = ?, RegistrationDate = ? WHERE UserId = ?",
        [FullName, Address, RegistrationDate, id],
        (err, results) => {
            if (err) throw err;
            res.json({ message: "User updated" });
        }
    );
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM User WHERE UserId = ?", [id], (err, results) => {
        if (err) throw err;
        res.json({ message: "User deleted" });
    });
});

app.get("/products", (req, res) => {
    db.query("SELECT * FROM Product", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/products", (req, res) => {
    const { ProductName, Price, ManufacturingDate } = req.body;
    db.query(
        "INSERT INTO Product (ProductName, Price, ManufacturingDate) VALUES (?, ?, ?)",
        [ProductName, Price, ManufacturingDate],
        (err, results) => {
            if (err) throw err;
            res.json({ message: "Product added", productId: results.insertId });
        }
    );
});

app.get("/cart", (req, res) => {
    db.query("SELECT * FROM ShoppingCart", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/cart", (req, res) => {
    const { UserId, ProductId, Quantity } = req.body;
    db.query(
        "INSERT INTO ShoppingCart (UserId, ProductId, Quantity) VALUES (?, ?, ?)",
        [UserId, ProductId, Quantity],
        (err, results) => {
            if (err) throw err;
            res.json({ message: "Item added to cart", cartId: results.insertId });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
