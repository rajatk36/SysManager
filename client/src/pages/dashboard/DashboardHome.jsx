import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FaUsers, FaFileInvoice,  FaClock, FaCheckCircle, FaTimesCircle, FaRupeeSign } from 'react-icons/fa';
import './dashboard.css';

const DashboardHome = ({ userId, customers, bills, loading, loadingBills }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBills: 0,
    totalAmount: 0,
    paidBills: 0,
    unpaidBills: 0,
    pendingBills: 0,
    pendingAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0
  });

  useEffect(() => {
    if (customers && bills) {
      calculateStats();
    }
  }, [customers, bills]);

  const calculateStats = () => {
    const totalCustomers = customers.length;
    const totalBills = bills.length;
    const totalAmount = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
    const paidBills = bills.filter(bill => bill.status === 'paid').length;
    const unpaidBills = bills.filter(bill => bill.status === 'unpaid').length;
    const pendingBills = bills.filter(bill => bill.status === 'pending').length;
    const paidAmount = bills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
    const unpaidAmount = bills
      .filter(bill => bill.status === 'unpaid')
      .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
    const pendingAmount = bills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);

    setStats({
      totalCustomers,
      totalBills,
      totalAmount,
      paidBills,
      unpaidBills,
      pendingBills,
      pendingAmount,
      paidAmount,
      unpaidAmount
    });
  };

  // Chart data - filter out zero values to prevent overlapping labels
  const billStatusData = [
    { name: 'Paid', value: stats.paidAmount || 0, color: '#28a745' },
    { name: 'Unpaid', value: stats.unpaidAmount || 0, color: '#dc3545' },
    { name: 'Pending', value: stats.pendingAmount || 0, color: '#ffc107' }
  ].filter(item => item.value > 0);

  // If all values are zero, show a single "No Data" slice
  const displayData = billStatusData.length > 0 ? billStatusData : [
    { name: 'No Bills', value: 1, color: '#6c757d' }
  ];
  
  //customer growth
  const CustomerGrowthData = (customers) => {
    const monthCounts = {};
    const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    months.forEach((m) => {
      monthCounts[m] = 0;
    });
    customers.forEach((c) => {
      if (!c.createdAt) return;
      const month = new Date(c.createdAt).toLocaleString("en-US", { month: "short" });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      return Object.entries(monthCounts).map(([month, count]) => ({
        month,
        customers: count,
      }));
  };
  const customerGrowthData = CustomerGrowthData(customers);
  

  
  //monthly revenue
  const monthlyData = [
    { month: 'Jan', amount: 1200, bills: 5 },
    { month: 'Feb', amount: 1900, bills: 8 },
    { month: 'Mar', amount: 3000, bills: 12 },
    { month: 'Apr', amount: 2800, bills: 10 },
    { month: 'May', amount: 1890, bills: 7 },
    { month: 'Jun', amount: 2390, bills: 9 }
  ];

 

  const StatCard = ({ title, value, icon, color, subtitle, secondaryValue }) => (
    <div className="card stat-card h-100">
      <div className="card-body d-flex align-items-center">
        <div className={`stat-icon ${color}`}>
          {icon}
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{value}</h3>
          <p className="stat-title">{title}</p>
          {secondaryValue && <div className="stat-secondary">{secondaryValue}</div>}
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </div>
    </div>
  );

  if (loading || loadingBills) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business.</p>
          </div>
        </div>

        {/* Statistics Cards - Responsive Grid */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="row g-2">
              {/* Main Statistics */}
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={<FaUsers />}
                  color="primary"
                  
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Total Bills"
                  value={stats.totalBills}
                  icon={<FaFileInvoice />}
                  color="info"
                  
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Total Revenue"
                  value={`₹${(stats.totalAmount || 0).toFixed(2)}`}
                  icon={<FaRupeeSign />}
                  color="secondary"
                  
                />
              </div>
              
              {/* Bill Status Cards */}
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Paid Bills"
                  value={`₹${(stats.paidAmount || 0).toFixed(2)}`}
                  icon={<FaCheckCircle />}
                  color="success"
                  secondaryValue={`${stats.paidBills || 0} bills`}
                  subtitle="Successfully paid"
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Unpaid Bills"
                  value={`₹${(stats.unpaidAmount || 0).toFixed(2)}`}
                  icon={<FaTimesCircle />}
                  color="danger"
                  secondaryValue={`${stats.unpaidBills || 0} bills`}
                  subtitle="Payment overdue"
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 col-xxs-6">
                <StatCard
                  title="Pending Bills"
                  value={`₹${(stats.pendingAmount || 0).toFixed(2)}`}
                  icon={<FaClock />}
                  color="warning"
                  secondaryValue={`${stats.pendingBills || 0} bills`}
                  subtitle="Awaiting payment"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row mb-5">
          {/* Bill Status Pie Chart */}
          <div className="col-xl-6 col-lg-12 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaCheckCircle className="me-2" />
                  Bill Status Distribution
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => {
                        // Only show labels for slices that are large enough
                        return percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '';
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      innerRadius={20}
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
                      labelFormatter={(label) => `Status: ${label}`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => {
                        // Show all categories in legend with amounts
                        const allCategories = [
                          { name: 'Paid', amount: stats.paidAmount || 0, count: stats.paidBills || 0 },
                          { name: 'Unpaid', amount: stats.unpaidAmount || 0, count: stats.unpaidBills || 0 },
                          { name: 'Pending', amount: stats.pendingAmount || 0, count: stats.pendingBills || 0 }
                        ];
                        const category = allCategories.find(cat => cat.name === value);
                        return `${value} (₹${(category ? category.amount : 0).toFixed(2)})`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="col-xl-6 col-lg-12 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaRupeeSign className="me-2" />
                  Monthly Revenue
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Growth and Bill Trends */}
        <div className="row mb-5">
          <div className="col-xl-6 col-lg-12 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaUsers className="me-2" />
                  Customer Growth
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="customers" stroke="#28a745" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-12 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaFileInvoice className="me-2" />
                  Bills vs Revenue
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bills" fill="#17a2b8" name="Number of Bills" />
                    <Bar yAxisId="right" dataKey="amount" fill="#ffc107" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaTimesCircle className="me-2" />
                  Quick Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center g-2">
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                    <div className="quick-stat">
                      <h4 className="text-success">{stats.paidBills}</h4>
                      <p className="text-muted">Paid Bills</p>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                    <div className="quick-stat">
                      <h4 className="text-danger">{stats.unpaidBills}</h4>
                      <p className="text-muted">Unpaid Bills</p>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                    <div className="quick-stat">
                      <h4 className="text-warning">{stats.pendingBills}</h4>
                      <p className="text-muted">Pending Bills</p>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                    <div className="quick-stat">
                      <h4 className="text-info">{stats.totalCustomers}</h4>
                      <p className="text-muted">Total Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

