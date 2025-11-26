import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminCategories from './pages/AdminCategories';
import AdminCategoryForm from './pages/AdminCategoryForm';
import AdminItems from './pages/AdminItems';
import AdminItemForm from './pages/AdminItemForm';
import AdminAuctions from './pages/AdminAuctions';
import AdminAuctionForm from './pages/AdminAuctionForm';
import AuctionRoom from './pages/AuctionRoom';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';
import MyBids from './pages/MyBids';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auctions" element={<Auctions />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin/categories" element={<AdminCategories />} />
            <Route path="admin/categories/new" element={<AdminCategoryForm />} />
            <Route path="admin/categories/:id/edit" element={<AdminCategoryForm />} />

            <Route path="admin/items" element={<AdminItems />} />
            <Route path="admin/items/new" element={<AdminItemForm />} />
            <Route path="admin/items/:id/edit" element={<AdminItemForm />} />

            <Route path="admin/auctions" element={<AdminAuctions />} />
            <Route path="admin/auctions/new" element={<AdminAuctionForm />} />
            <Route path="admin/auctions/:id/edit" element={<AdminAuctionForm />} />

            <Route path="admin/users" element={<AdminUsers />} />
          </Route>

          <Route element={<ProtectedRoute roles={['participant', 'admin']} />}>
            <Route path="auction/:id" element={<AuctionRoom />} />
            <Route path="my-bids" element={<MyBids />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
