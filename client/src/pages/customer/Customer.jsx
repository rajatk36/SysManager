import Customerform from "./parts/CustomerForm.jsx";
import CustomerList from "./parts/CustomerList.tsx";

function Customer({ userId , loading , customers , setCustomers, fetchCustomers }) {   
  
  // Add customer
  const handleAddCustomer = async (newCustomer) => {
    const customerWithMeta = {
      ...newCustomer,
      id: newCustomer._id || newCustomer.id || Date.now().toString(),
      createdAt: newCustomer.createdAt ? new Date(newCustomer.createdAt) : new Date(),
    };
    setCustomers((prev) => [...prev, customerWithMeta]);

    if (userId) {
      await fetchCustomers(userId);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      console.log("🗑️ Deleting customer with ID:", id);
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Customer deleted from backend:", result);

      setCustomers((prev) => prev.filter((c) => (c.id || c._id) !== id));

      if (userId) {
        await fetchCustomers(userId);
      }
    } catch (error) {
      console.error("❌ Error deleting customer:", error);
      alert(`Failed to delete customer: ${error.message}`);
    }
  };

  return (
    <>
      <Customerform onAddCustomer={handleAddCustomer} userId={ userId} />
      <CustomerList
        customers={customers}
        onDeleteCustomer={handleDeleteCustomer}
        loading={loading}
        userId={userId}
      />
    </>
  );
}

export default Customer;
