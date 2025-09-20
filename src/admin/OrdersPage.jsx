import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../firebase/firestoreService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getOrders((orderList) => {
      setOrders(orderList);
      setFilteredOrders(orderList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter and search orders using unified schema
  useEffect(() => {
    let filtered = orders;

    // Filter by status - use unified 'status' field
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search by multiple fields from unified schema
    if (search) {
      filtered = filtered.filter(order => {
        const searchTerm = search.toLowerCase();
        const matchesCustomer = order.customerName?.toLowerCase().includes(searchTerm);
        const matchesPhone = order.phone?.toLowerCase().includes(searchTerm);
        const matchesOrderId = order.orderId?.toLowerCase().includes(searchTerm);
        const matchesId = order.id?.toLowerCase().includes(searchTerm);
        const matchesAddress = order.address?.toLowerCase().includes(searchTerm);
        const matchesPlace = order.place?.toLowerCase().includes(searchTerm);
        const matchesTransport = order.transport?.toLowerCase().includes(searchTerm);
        const matchesType = order.type?.toLowerCase().includes(searchTerm);
        const matchesEmail = order.email?.toLowerCase().includes(searchTerm);
        
        return matchesCustomer || matchesPhone || matchesOrderId || matchesId || 
               matchesAddress || matchesPlace || matchesTransport || matchesType || matchesEmail;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, search, statusFilter]);

  const handleStatusUpdate = async (docId, newStatus) => {
    try {
      await updateOrderStatus(docId, newStatus);
      // Orders will be updated automatically through the real-time listener
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Dispatched': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Pending').length,
    dispatched: orders.filter(order => order.status === 'Dispatched').length,
    delivered: orders.filter(order => order.status === 'Delivered').length
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-lg p-6 mb-6 text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Orders Management</h1>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <div className="text-sm opacity-90">Total Orders</div>
          </div>
          <div className="bg-yellow-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold">{orderStats.pending}</div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
          <div className="bg-blue-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold">{orderStats.dispatched}</div>
            <div className="text-sm opacity-90">Dispatched</div>
          </div>
          <div className="bg-green-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
            <div className="text-sm opacity-90">Delivered</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by Customer, Phone, Order ID, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-6 py-8 text-center text-gray-500">
                    {search || statusFilter !== 'all' ? 'No orders found matching your criteria.' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // Use unified schema fields
                  const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                  const orderDate = order.date ? 
                    (order.date.toDate ? new Date(order.date.toDate()).toLocaleDateString() : new Date(order.date).toLocaleDateString()) : 'N/A';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="font-mono">{order.orderId || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Doc: {order.id?.slice(-6)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.phone || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2 mb-1">
                              <div className="flex-shrink-0 h-8 w-8">
                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <rect x="3" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="#f3f4f6" />
                                  <rect x="8" y="3" width="8" height="4" rx="1" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb" />
                                  <circle cx="12" cy="14" r="3" stroke="#9ca3af" strokeWidth="2" fill="#e5e7eb" />
                                </svg>
                              </div>
                              <span className="text-xs">
                                {item.name} (x{item.quantity || 0})
                                <div className="text-gray-500">₹{item.unitPrice} - ₹{item.discount || 0} = ₹{item.finalPrice || item.unitPrice}</div>
                              </span>
                            </div>
                          )) || 'No items'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.discount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>₹{order.totalAmount || order.total || 0}</div>
                        <div className="text-xs text-gray-500">Net: ₹{order.netAmount || order.totalAmount || order.total || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {orderDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {order.address || 'N/A'}
                          {order.place && <div className="text-xs text-gray-500">{order.place}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.transport || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.type === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.type || 'TO-PAY'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'Pending').length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'Dispatched').length}
          </div>
          <div className="text-sm text-gray-500">Dispatched</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <div className="text-sm text-gray-500">Delivered</div>
        </div>
      </div>
    </div>
  );
}
