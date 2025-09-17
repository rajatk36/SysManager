const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint to verify server is running
app.get("/", (req, res) => {
  res.json({ 
    message: "Customer Management API is running!", 
    timestamp: new Date().toISOString(),
    status: "OK",
    endpoints: {
      test: "GET /",
      addCustomer: "POST /api/customers",
      getCustomers: "GET /api/customers/user/:userId",
      deleteCustomer: "DELETE /api/customers/:customerId"
    }
  });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI ;
const port = process.env.PORT;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected to:", mongoURI))
.catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log("Make sure MongoDB is running and network access is enabled.");
    process.exit(1);
});


app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/bills" , require("./routes/billRoutes"));

app.listen(port, () => console.log(`Server running on port ${port}`));
