import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, updateOrderTransport, updateOrderType, deleteOrder } from '../firebase/firestoreService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);

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

  const handleTransportUpdate = async (docId, transport) => {
    try {
      await updateOrderTransport(docId, transport);
      // Orders will be updated automatically through the real-time listener
    } catch (error) {
      console.error('Error updating transport:', error);
      alert('Failed to update order transport: ' + error.message);
    }
  };

  const handleTypeUpdate = async (docId, type) => {
    try {
      await updateOrderType(docId, type);
      // Orders will be updated automatically through the real-time listener
    } catch (error) {
      console.error('Error updating type:', error);
      alert('Failed to update order type: ' + error.message);
    }
  };

  const handleEditOrder = (order) => {
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit order:', order);
    alert(`Edit functionality for Order ID: ${order.orderId}\nThis will open an edit form in a future update.`);
  };

  const handleViewOrder = (order) => {
    setViewOrder(order);
  };

  const handleCloseView = () => {
    setViewOrder(null);
  };

  const handlePrintOrder = (order) => {
    // Create printable content
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #dc2626; margin-bottom: 20px;">VEENA CRACKERS - Order Invoice</h2>
        
        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderId || 'N/A'}</p>
          <p><strong>Date:</strong> ${order.date ? new Date(order.date.toDate()).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
          <p><strong>Type:</strong> ${order.type || 'TO-PAY'}</p>
          <p><strong>Transport:</strong> ${order.transport || 'N/A'}</p>
        </div>

        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${order.customerName || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${order.address || 'N/A'}</p>
          <p><strong>Place:</strong> ${order.place || 'N/A'}</p>
        </div>

        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 20px;">
          <h3>Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Quantity</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Unit Price</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Discount</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 8px;">${item.name || 'N/A'}</td>
                  <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.quantity || 0}</td>
                  <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">₹${item.unitPrice || 0}</td>
                  <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">₹${item.discount || 0}</td>
                  <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">₹${item.total || (item.quantity || 0) * (item.finalPrice || item.unitPrice || 0)}</td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align: center; padding: 8px;">No items</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="border: 1px solid #ccc; padding: 15px;">
          <h3>Payment Summary</h3>
          <p><strong>Subtotal:</strong> ₹${order.total || 0}</p>
          <p><strong>Discount:</strong> ₹${order.discount || 0}</p>
          <p><strong>Net Amount:</strong> ₹${order.netAmount || order.totalAmount || order.total || 0}</p>
        </div>
      </div>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice - ${order.orderId}</title>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDeleteOrder = async (order) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this order?\n\nOrder ID: ${order.orderId}\nCustomer: ${order.customerName}\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await deleteOrder(order.id);
        // Orders will be updated automatically through the real-time listener
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order: ' + error.message);
      }
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
                  No. of Items
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
                  <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                    {search || statusFilter !== 'all' ? 'No orders found matching your criteria.' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // Use unified schema fields
                  const numberOfItems = order.items?.length || 0; // Number of different items, not total quantity
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {numberOfItems}
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
                        <select
                          value={order.type || 'TO-PAY'}
                          onChange={(e) => handleTypeUpdate(order.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="TO-PAY">TO-PAY</option>
                          <option value="PAID">PAID</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditOrder(order)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                              title="Edit Order"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-800 border border-purple-300 rounded hover:bg-purple-50 transition-colors"
                              title="View Order Details"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handlePrintOrder(order)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition-colors"
                              title="Print Order"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                              title="Delete Order"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
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

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseView}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Details - {viewOrder.orderId}
                  </h3>
                  <button
                    onClick={handleCloseView}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Order ID:</span> {viewOrder.orderId || 'N/A'}</div>
                      <div><span className="font-medium">Date:</span> {viewOrder.date ? new Date(viewOrder.date.toDate()).toLocaleDateString() : 'N/A'}</div>
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          viewOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          viewOrder.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {viewOrder.status || 'Pending'}
                        </span>
                      </div>
                      <div><span className="font-medium">Type:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          viewOrder.type === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {viewOrder.type || 'TO-PAY'}
                        </span>
                      </div>
                      <div><span className="font-medium">Transport:</span> {viewOrder.transport || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {viewOrder.customerName || 'N/A'}</div>
                      <div><span className="font-medium">Phone:</span> {viewOrder.phone || 'N/A'}</div>
                      <div><span className="font-medium">Email:</span> {viewOrder.email || 'N/A'}</div>
                      <div><span className="font-medium">Address:</span> {viewOrder.address || 'N/A'}</div>
                      <div><span className="font-medium">Place:</span> {viewOrder.place || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewOrder.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{item.quantity || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.unitPrice || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{item.discount || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.finalPrice || item.unitPrice || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.total || (item.quantity || 0) * (item.finalPrice || item.unitPrice || 0)}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No items found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Subtotal:</span>
                      <div className="text-lg font-bold">₹{viewOrder.total || 0}</div>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Total Discount:</span>
                      <div className="text-lg font-bold text-green-600">₹{viewOrder.discount || 0}</div>
                    </div>
                    <div>
                      <span className="font-medium">Net Amount:</span>
                      <div className="text-xl font-bold text-red-600">₹{viewOrder.netAmount || viewOrder.totalAmount || viewOrder.total || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseView}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
