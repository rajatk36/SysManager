import {  useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import "../customer.css"


export function Customerform({ onAddCustomer , userId}) {
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const requestBody = {
        userId, 
        ...formData
      };
      
      console.log("🚀 Sending request to:", "${process.env.REACT_APP_SERVER_URL}/api/customers");
      console.log("📦 Request body:", requestBody);
      
      const response = await fetch("${process.env.REACT_APP_SERVER_URL}/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

    const data = await response.json();
    console.log("✅ Customer added:", data);

    // Add this line to update the parent component's state
    onAddCustomer(data);

    setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        notes: "",
      });
    } catch (error) {
      console.error("❌ Error adding customer:", error);
      console.error("📋 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Show user-friendly error message
      alert(`Failed to add customer: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
  <div className="customer-form"> 
    <div className="card">
      <div className="card-header bg-light">
        <h5 className="mb-0 d-flex align-items-center">
          <i className="bi bi-person-plus me-2"></i> Add New Customer
        </h5>
        <small className="text-muted">
          Enter customer information to add them to your database
        </small>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="row g-3 ">
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Company */}
          <div className="col-md-6">
            <label htmlFor="company" className="form-label">
              Company
            </label>
            <input
              type="text"
              className="form-control"
              id="company"
              placeholder="Acme Corporation"
              value={formData.company}
              onChange={(e) => updateFormData("company", e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="mt-0">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="123 Main St, City, State 12345"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="mt-0">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-control"
              id="notes"
              rows={3}
              placeholder="Additional notes about the customer..."
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Customer..." : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  </div>  
  );
}


export default Customerform;