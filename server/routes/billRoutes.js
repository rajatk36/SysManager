const express = require ("express");
const router = express.Router();
const Bill = require("../model/Bill");

//create new bill
router.post("/", async (req, res) => {
    const{userId,customerId,amount,quantity,description,status}=req.body;
    try{
     if(!userId || !customerId || !amount){
        return res.status(400).json({error:"Please provide all required fields"});
     }
     const bill = new Bill({user:userId,customer:customerId,amount,quantity,description,status});
     const savedBill = await bill.save();
     res.status(201).json(savedBill);
    }catch(err){
        console.error("Bill creation error:", err);
        res.status(400).json({error:err.message});
    }
});
// get all bills for a user (for dashboard analytics)
// Place BEFORE the generic customerId route so it isn't shadowed
router.get("/user/:userId/all", async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.params.userId });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// (Removed regex route due to path-to-regexp syntax issue)

//get all bills for a customer
router.get("/:customerId" , async (req, res) => {
    try{
    const bills = await Bill.find({customer:req.params.customerId});
    res.json(bills);
    }catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// update bill status
router.put("/:billId/status", async (req, res) => {
    try{
        const { status } = req.body;
        if (!status || !["unpaid","paid","pending"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const updated = await Bill.findByIdAndUpdate(
            req.params.billId,
            { status },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Bill not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete all bills for a specific customer
router.delete("/customer/:customerId", async (req, res) => {
    try{
        const { customerId } = req.params;
        // Support both string and ObjectId storage of customer
        const mongoose = require("mongoose");
        const conditions = [{ customer: customerId }];
        if (mongoose.Types.ObjectId.isValid(customerId)) {
            conditions.push({ customer: new mongoose.Types.ObjectId(customerId) });
        }
        const result = await Bill.deleteMany({ $or: conditions });
        console.log("[DELETE ALL BILLS] customerId=", customerId, "deletedCount=", result?.deletedCount);
        res.json({ deletedCount: result?.deletedCount ?? 0 });
    } catch (err) {
        console.error("[DELETE ALL BILLS] error:", err);
        res.status(500).json({ error: err.message });
    }
});

// delete a single bill by id (avoid conflict by using explicit prefix)
router.delete("/id/:billId", async (req, res) => {
    try{
        const { billId } = req.params;
        const deleted = await Bill.findByIdAndDelete(billId);
        console.log("[DELETE BILL] billId=", billId, "deleted=", Boolean(deleted));
        if (!deleted) return res.status(404).json({ error: "Bill not found" });
        res.json({ message: "Bill deleted", deleted });
    } catch (err) {
        console.error("[DELETE BILL] error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;