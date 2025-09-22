import React, { useState } from "react";

// Define the Customer interface locally since it's not properly exported
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: Date | string;
}

interface CustomerListProps {
  customers: Customer[];
  onDeleteCustomer: (id: string) => void;
  loading?: boolean;
}

function CustomerList({ customers = [], onDeleteCustomer, loading }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  
  // Debug logging to see what customers are being passed
  console.log('CustomerList received customers:', customers);
  console.log('Current search term:', searchTerm);

  const filteredCustomers = (customers ?? []).filter((customer) => {
    // Add null/undefined checks to prevent errors
    const firstName = customer.firstName?.toLowerCase() || "";
    const lastName = customer.lastName?.toLowerCase() || "";
    const email = customer.email?.toLowerCase() || "";
    const company = customer.company?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    
    // Debug logging to help troubleshoot search issues
    if (searchTerm) {
      console.log('Searching for:', searchLower);
      console.log('Customer data:', { firstName, lastName, email, company });
      console.log('Search matches:', {
        firstNameMatch: firstName.includes(searchLower),
        lastNameMatch: lastName.includes(searchLower),
        emailMatch: email.includes(searchLower),
        companyMatch: company.includes(searchLower)
      });
    }
    
    return (
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      email.includes(searchLower) ||
      company.includes(searchLower)
    );
  });

  const formatDate = (date: Date | string | undefined) => {
    if (!date) {
      return "—";
    }
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return "—";
      }
      
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error, "Date value:", date);
      return "—";
    }
  };

  return (
    <div className="card shadow-sm w-100 mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-people me-2"></i> Customer List
          </h5>
          <small className="text-muted">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} total
            {searchTerm && (
              <span className="ms-2">
                • {filteredCustomers.length} found for "{searchTerm}"
              </span>
            )}
          </small>
        </div>

        {/* Search Input */}
        <div className="input-group w-50 d-flex justify-content-end">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <div >
            <input
            type="text"
            className="form-control w-80"
            placeholder="Search customers..."
            value={searchTerm}
            key="search-input"
            onChange={(e) => {
              const value = e.target.value;
              console.log('Search input changed:', value);
              setSearchTerm(value);
            }}
          />
          </div>
          {/* <small className="text-muted mt-1">
            Debug: Search term = "{searchTerm}" | Filtered count = {filteredCustomers.length}
          </small> */}
          
        </div>
      </div>

      <div className="card-body">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people text-muted fs-1"></i>
            <h5 className="mt-3">
              {customers.length === 0 ? "No customers yet" : "No customers found"}
            </h5>
            <p className="text-muted">
              {customers.length === 0
                ? "Add your first customer using the form above."
                : "Try adjusting your search terms."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>Created</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    {/* Name */}
                    <td>
                      <strong>
                        {customer.firstName} {customer.lastName}
                      </strong>
                    </td>

                    {/* Contact */}
                    <td>
                      <div>
                        <div>
                          <i className="bi bi-envelope me-1 text-muted"></i>
                          <a href={`mailto:${customer.email}`}>
                            {customer.email}
                          </a>
                        </div>
                        
                          <div className="text-muted small">
                            <i className="bi bi-telephone me-1"></i>
                            <a href={`tel:${customer.phone}`}>
                              {customer.phone}
                            </a>
                          </div>
                        
                      </div>
                    </td>

                    {/* Company */}
                    <td>
                      {customer.company ? (
                        <span className="badge bg-secondary">
                          {customer.company}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Address */}
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {customer.address || (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {customer.notes || <span className="text-muted">—</span>}
                    </td>

                    {/* Created Date */}
                    <td className="text-muted small">
                      {formatDate(customer.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteCustomer(customer.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;

