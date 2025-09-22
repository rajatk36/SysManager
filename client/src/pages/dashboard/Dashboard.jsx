import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import './dashboard.css'
import { Routes,Route } from "react-router-dom";
import Customer from "../customer/Customer.jsx"
import Bill from "../bill/Bill.jsx"
import Profile from "../profile/Profile.jsx"
import DashboardHome from "./DashboardHome.jsx"
import { useState, useEffect } from "react";



const Dashboard= ({ userId }  ) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch customers when userId changes
    useEffect(() => {
      if (!userId) {
        setCustomers([]);
        setLoading(false);
        return;
      }
      fetchCustomers(userId);
    }, [userId]);
  
    const fetchCustomers = async (uid) => {
      setLoading(true);
      try {
        console.log("Fetching customers from:", `${process.env.REACT_APP_SERVER_URL}/api/customers/${uid}`);
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customers/${uid}`);
        console.log("Customers response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Customers data received:", data);
          const normalized = (data ?? []).map((c) => ({
            ...c,
            id: c._id || c.id,
            createdAt: c.createdAt || c.updatedAt,
          }));
          setCustomers(normalized);
        } else {
          console.log("Customers fetch failed with status:", response.status);
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    const [bills, setBills]= useState([]);
    const [loadingBills, setLoadingBills] = useState(true);

    // Fetch all bills for the user
    useEffect(() => {
      if (!userId) {
        setBills([]);
        setLoadingBills(false);
        return;
      }
      console.log("Dashboard: Fetching bills for userId:", userId);
      fetchAllBills(userId);
    }, [userId]);

    const fetchAllBills = async (uid) => {
      setLoadingBills(true);
      try {
        console.log("Fetching bills from:", `${process.env.REACT_APP_SERVER_URL}/api/bills/user/${uid}/all`);
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/bills/user/${uid}/all`);
        console.log("Bills response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Bills data received:", data);
          const normalized = (data ?? []).map((b) => ({
            ...b,
            id: b._id || b.id,
            createdAt: b.createdAt || b.updatedAt,
          }));
          setBills(normalized);
        } else {
          console.log("Bills fetch failed with status:", response.status);
          setBills([]);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        setBills([]);
      } finally {
        setLoadingBills(false);
      }
    };

    // Fetch bills when customerId changes
    const fetchBills = async (cid) => {
      setLoadingBills(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/bills/${cid}`);
        if (response.ok) {
          const data = await response.json();
          const normalized = (data ?? []).map((b) => ({
            ...b,
            id: b._id || b.id,
            createdAt: b.createdAt || b.updatedAt,
          }));
          setBills(normalized);
        } else {
          setBills([]);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        setBills([]);
      } finally {
        setLoadingBills(false);
      }
    };
  return (
    <div className='dashboard'>
      <div className='main-content'>
        <Routes>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/customer" element={<Customer userId={userId} loading={loading} customers={customers} setCustomers={setCustomers} fetchCustomers={fetchCustomers} />} />
          <Route path="/bill" element={<Bill userId={userId} loadingBills={loadingBills} customers={customers} setLoadingBills={setLoadingBills} bills={bills} setBills={setBills} fetchBills={fetchBills} />} />
          <Route path="" element={<DashboardHome userId={userId} customers={customers} bills={bills} loading={loading} loadingBills={loadingBills} />} />
        </Routes>
      </div>  
    </div>
 
  
  )
}

export default Dashboard