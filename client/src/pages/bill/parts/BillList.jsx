import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../bill.css";
import { FaRupeeSign } from "react-icons/fa";

const BillList = ({ bills, loading, selectedCustomer, customers, onCustomerSelect, onDeleteBill, onUpdateBill }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    let billsToFilter = bills;
    
    // Always filter by customer if selected - show only bills for selected customer
    if (selectedCustomer) {
      billsToFilter = bills.filter(bill => 
        bill.customer === selectedCustomer || bill.customerId === selectedCustomer
      );
    } else {
      // If no customer selected, show empty list
      billsToFilter = [];
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      billsToFilter = billsToFilter.filter(bill => {
        const description = (bill.description || '').toLowerCase();
        const customerName = getCustomerName(bill.customer || bill.customerId).toLowerCase();
        const amount = (bill.amount || '').toString();
        const status = (bill.status || '').toLowerCase();
        
        return (
          description.includes(searchLower) ||
          customerName.includes(searchLower) ||
          amount.includes(searchLower) ||
          status.includes(searchLower)
        );
      });
    }
    
    setFilteredBills(billsToFilter);
  }, [bills, selectedCustomer, searchTerm, customers]);

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId || c._id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      paid: 'badge bg-success',
      unpaid: 'badge bg-danger',
      pending: 'badge bg-warning'
    };
    return statusClasses[status] || 'badge bg-secondary';
  };

  const formatDate = (date) => {
    if (!date) return "—";
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "—";
      
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "—";
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/bills/id/${billId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          if (onDeleteBill) {
            onDeleteBill(billId);
          }
        } else {
          const errorData = await response.json();
          alert(`Failed to delete bill: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Failed to delete bill');
      }
    }
  };

  const handleStatusChange = async (billId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/bills/${billId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        const updatedBill = await response.json();
        if (onUpdateBill) {
          onUpdateBill(updatedBill);
        }
        setEditingStatus(null); // Close the dropdown after successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update bill status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating bill status:', error);
      alert('Failed to update bill status');
    }
  };

  const handleStatusClick = (billId) => {
    setEditingStatus(editingStatus === billId ? null : billId);
  };

  const handleStatusSelect = (billId, newStatus) => {
    handleStatusChange(billId, newStatus);
  };

  return (
    <div className="bill-list">
      <div className="card shadow-sm w-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-receipt me-2"></i> 
              {selectedCustomer ? `Bills for ${getCustomerName(selectedCustomer)}` : 'Bill List'}
            </h5>
            <small className="text-muted">
              {selectedCustomer ? `${filteredBills.length} bill${filteredBills.length !== 1 ? "s" : ""} for selected customer` : 'Select a customer to view bills'}
              {searchTerm && (
                <span className="ms-2">
                  • {filteredBills.length} found for "{searchTerm}"
                </span>
              )}
            </small>
          </div>

          {/* Search Input */}
          <div className="input-group w-50">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div className="text-center py-5" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading bills...</p>
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-5" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <i className="bi bi-receipt text-muted fs-1"></i>
              <h5 className="mt-3">
                {!selectedCustomer ? "Select a customer to view bills" : searchTerm ? "No bills found" : "No bills for this customer"}
              </h5>
              <p className="text-muted">
                {!selectedCustomer 
                  ? "Choose a customer from the dropdown above to see their bills."
                  : searchTerm 
                    ? "Try adjusting your search terms."
                    : "This customer doesn't have any bills yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <table className="table table-hover align-middle" style={{ marginBottom: 0 }}>
                <thead className="table-light">
                  <tr>
                  
                    <th>Amount</th>
                    <th className="text-center">Quantity</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill.id || bill._id}>
                     
                      <td>
                        <span className="fw-bold text-success">
                          <FaRupeeSign style={{ fontSize: "13px" , marginBottom:"2px" }}/>{parseFloat(bill.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center">{bill.quantity || 'N/A'}</td>
                      <td className="text-center">{bill.description || 'N/A'}</td>
                      <td>
                        {editingStatus === (bill.id || bill._id) ? (
                          <select
                            className="form-select form-select-sm"
                            value={bill.status || 'unpaid'}
                            onChange={(e) => handleStatusSelect(bill.id || bill._id, e.target.value)}
                            onBlur={() => setEditingStatus(null)}
                            autoFocus
                            style={{ 
                              minWidth: '100px',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                          </select>
                        ) : (
                          <span 
                            className={`${getStatusBadge(bill.status)} cursor-pointer`}
                            onClick={() => handleStatusClick(bill.id || bill._id)}
                            style={{ cursor: 'pointer' }}
                            title="Click to change status"
                          >
                            {bill.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        )}
                      </td>
                      <td className="text-muted small">
                        {formatDate(bill.createdAt)}
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBill(bill.id || bill._id)}
                            title="Delete Bill"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillList;
