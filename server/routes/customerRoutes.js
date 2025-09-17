const express = require("express");
const router = express.Router();
const Customer = require("../model/Customer");
const Bill = require("../model/Bill");
const mongoose = require("mongoose");

// Create new customer
router.post("/", async (req, res) => {
  try {    
    const { userId, firstName, lastName, email, phone, company, address, notes } = req.body;
    // Validate required fields
    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, firstName, lastName, and email are required" 
      });
    }

    
    const customer = new Customer({ 
      user: userId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      address, 
      notes 
    });
    
    console.log("📝 Customer object created:", customer);
    
    const savedCustomer = await customer.save();
    console.log("💾 Customer saved successfully:", savedCustomer);
    
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error("Customer creation error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get all customers for a user
router.get("/:userId", async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.params.userId });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete customer by ID
router.delete("/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Cascade delete bills for this customer (support both string and ObjectId stored values)
    const conditions = [{ customer: customerId }];
    if (mongoose.Types.ObjectId.isValid(customerId)) {
      conditions.push({ customer: new mongoose.Types.ObjectId(customerId) });
    }
    const billResult = await Bill.deleteMany({ $or: conditions });

    res.json({ 
      message: "Customer and related bills deleted successfully", 
      deletedCustomer, 
      deletedBillsCount: billResult?.deletedCount ?? 0 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
