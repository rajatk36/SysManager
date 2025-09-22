import "./bill.css"
import BillForm from "./parts/BillForm"
import BillList from "./parts/BillList"
import { useState } from "react"

function Bill({userId , customers, bills, setBills, fetchBills, loadingBills}){
    const [selectedCustomer, setSelectedCustomer] = useState("");

    const handleAddBill = async(newBill) => {
     const billwithMeta={
        ...newBill,
        id : newBill._id || newBill.id || Date.now().toString(),
        createdAt: newBill.createdAt ? new Date(newBill.createdAt) : new Date()
     };
     setBills((prev) => [...prev, billwithMeta]);
    }

    const handleDeleteBill = (billId) => {
        setBills((prev) => prev.filter(bill => (bill.id || bill._id) !== billId));
    }

    const handleUpdateBill = (updatedBill) => {
        setBills((prev) => prev.map(bill => 
            (bill.id || bill._id) === (updatedBill.id || updatedBill._id) 
                ? { ...bill, ...updatedBill }
                : bill
        ));
    }

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomer(customerId);
        if (customerId) {
            fetchBills(customerId);
        }
    }

    return(
        <div className="bill-page">
            <div className="row">
                <div className="col-md-6">
                    <BillForm 
                        userId={userId} 
                        handleAddBill={handleAddBill} 
                        loadingBills={loadingBills} 
                        customers={customers}
                        onCustomerSelect={handleCustomerSelect}
                        selectedCustomer={selectedCustomer}
                    />
                </div>
                <div className="col-md-6">
                    <BillList 
                        bills={bills}
                        loading={loadingBills}
                        selectedCustomer={selectedCustomer}
                        customers={customers}
                        onCustomerSelect={handleCustomerSelect}
                        onDeleteBill={handleDeleteBill}
                        onUpdateBill={handleUpdateBill}
                    />
                </div>
            </div>
        </div>
    )
}

export default Bill;