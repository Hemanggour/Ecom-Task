import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Package, ArrowLeft, Eye, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

interface Order {
  id: string;
  user_id: string;
  user_name?: string;
  total_amount: number;
  shipping_address: string;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = async (order: Order) => {
    try {
      const res = await api.get(`/orders/${order.id}`);
      setSelectedOrder(res.data);
      setShowDetails(true);
    } catch (err) {
      console.error('Failed to fetch order details', err);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={20} className="text-warning" />;
      case 'processing':
        return <Package size={20} className="text-primary" />;
      case 'shipped':
        return <Truck size={20} className="text-info" />;
      case 'delivered':
        return <CheckCircle size={20} className="text-success" />;
      case 'cancelled':
        return <XCircle size={20} className="text-danger" />;
      default:
        return <Clock size={20} className="text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning-10 text-warning border-warning';
      case 'processing':
        return 'bg-primary-10 text-primary border-primary';
      case 'shipped':
        return 'bg-info-10 text-info border-info';
      case 'delivered':
        return 'bg-success-10 text-success border-success';
      case 'cancelled':
        return 'bg-danger-10 text-danger border-danger';
      default:
        return 'bg-main text-muted border-border';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-12 animate-fade-in">
      <Link to="/admin" className="flex items-center gap-2 text-muted hover:text-primary transition mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Orders Management</h1>
          <p className="text-muted font-medium">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card p-6 border-2 border-primary-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-2xl"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Total Orders</p>
              <h4 className="text-2xl font-black">{orders.length}</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-2 border-warning-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-10 text-warning rounded-2xl"><Clock size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Pending</p>
              <h4 className="text-2xl font-black">{orders.filter(o => o.status.toLowerCase() === 'pending').length}</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-2 border-info-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info-10 text-info rounded-2xl"><Truck size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Shipped</p>
              <h4 className="text-2xl font-black">{orders.filter(o => o.status.toLowerCase() === 'shipped').length}</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-2 border-success-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-10 text-success rounded-2xl"><CheckCircle size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Delivered</p>
              <h4 className="text-2xl font-black">{orders.filter(o => o.status.toLowerCase() === 'delivered').length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card p-0 overflow-hidden border-border shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-main opacity-50 border-b border-border">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Order ID</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Customer</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Date</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Total</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10 h-20 bg-main opacity-20"></td>
                  </tr>
                ))
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-primary-light opacity-30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-bold text-lg">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-medium">{order.user_name || 'Unknown'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-muted text-sm">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="text-xs font-bold uppercase">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="p-3 bg-main border border-border rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted">
                      <ShoppingBag size={64} strokeWidth={1} />
                      <div>
                        <p className="text-xl font-bold text-main">No orders found</p>
                        <p className="text-sm">Orders will appear here when customers make purchases.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="card p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Order #{selectedOrder.id.slice(0, 8)}</h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-main rounded-lg transition"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.user_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Order Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Shipping Address</p>
                <p className="font-medium text-sm">{selectedOrder.shipping_address}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Status</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-lg border font-bold text-sm uppercase transition-all ${
                        selectedOrder.status.toLowerCase() === status
                          ? getStatusColor(status)
                          : 'bg-main text-muted border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-main opacity-30 rounded-xl">
                      <div className="h-16 w-16 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                        <Package size={24} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-muted">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                      <p className="font-black text-lg">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-2xl font-black">${Number(selectedOrder.total_amount).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
