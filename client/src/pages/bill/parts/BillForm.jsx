import "bootstrap/dist/css/bootstrap.min.css"
import React, { useState } from "react"
import "../bill.css"



function BillForm({userId , handleAddBill, loadingBills, customers=[], onCustomerSelect, selectedCustomer: propSelectedCustomer}){
    const [selectedCustomer, setSelectedCustomer] = useState(propSelectedCustomer || "");
    console.log("Selected Customer:", selectedCustomer);
    
    const [formData , setFormData] = useState({
        amount: "",
        quantity: "",
        description: "",
        status: "unpaid",
        customerId: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    };
    // Function to handle form submission
    const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    
    // More specific validation with better error messages
    if (!selectedCustomer) {
      alert("Please select a customer");
      setIsSubmitting(false);
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount");
      setIsSubmitting(false);
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      alert("Please enter a valid quantity");
      setIsSubmitting(false);
      return;
    }
    if (!formData.description || formData.description.trim() === "") {
      alert("Please enter a description");
      setIsSubmitting(false);
      return;
    }
    try{
      const requestBody = {
        userId: userId,
        customerId: selectedCustomer,
        amount: formData.amount,
        quantity: formData.quantity,
        description: formData.description,
        status: formData.status
      }
      console.log("🚀 Sending request to:", "http://sysmanager/api/bills");
      console.log("📦 Request body:", requestBody);
      
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

    const data = await response.json();
    console.log("✅ Bill added:", data);

    // Add this line to update the parent component's state
    handleAddBill(data);

    setFormData({
        amount: "",
        quantity: "",
        description: "",
        status: "unpaid",
        customerId: ""
      });
    setSelectedCustomer("");
    } catch (error) {
      console.error("❌ Error adding bill:", error);
      console.error("📋 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Show user-friendly error message
      alert(`Failed to add bill: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
    return(
     <div className="bill-form">
       <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-person-plus me-2"></i> Add New Bill
            </h5>
            <small className="text-muted">
            Enter Bill details to add them to your database
            </small>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} >
                <div className="row g-3">
                 <div>
                    <div className="col-md-6">
                      <label htmlFor="billCustomer" className="form-label">Customer *</label>
                      <select 
                        id="billCustomer" 
                        className="form-select"
                        value={selectedCustomer}
                        onChange={(e) => {
                          setSelectedCustomer(e.target.value);
                          if (onCustomerSelect) {
                            onCustomerSelect(e.target.value);
                          }
                        }}
                        required
                      >
                        <option value="">Select a customer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                          </option>
                        ))}
                      </select>
                   </div>
                 </div>
                   
                   <div className="col-md-6">
                     <label htmlFor="amount" className="form-label">
                        Amount
                     </label>
                     <input 
                     type="number" 
                     className="form-control" 
                     id="amount" 
                     value={formData.amount}
                     onChange={(e) => updateFormData("amount", e.target.value)}
                     placeholder="Enter Amount" 
                   
                 required/>
                   </div>
                   <div className="col-md-6">
                     <label htmlFor="quantity" className="form-label">
                        Quantity
                     </label>
                     <input 
                     type="number" 
                     className="form-control" 
                     id="quantity" 
                     value={formData.quantity}
                     onChange={(e) => updateFormData("quantity", e.target.value)}
                     placeholder="Enter Quantity" 
                    
                    required/>
                   </div>
                   <div className="col-md-12">
                     <label htmlFor="description" className="form-label">
                        Description
                     </label>
                     <input 
                     type="text"
                     className="form-control"
                     id="description"
                     value={formData.description}
                     onChange={(e) => updateFormData("description", e.target.value)}
                     placeholder="Enter Description"
                     required/>
                   </div>
                    <div className="col-md-6">
                      <label htmlFor="billStatus" className="form-label">Status</label>
                      <select 
                        id="billStatus" 
                        className="form-select" 
                        value={formData.status} 
                        onChange={(e) => updateFormData("status", e.target.value)}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Adding Bill..." : "Add Bill"} 
                </button>
            </form>
          </div>
       </div>

     </div>
    )
}

export default BillForm;