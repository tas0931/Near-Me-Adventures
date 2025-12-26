import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Browse from './pages/Browse';
import AllPlaces from './pages/AllPlaces';
import SuggestPlaces from './pages/SuggestPlaces';
import Analysis from './pages/Analysis';
import UserAnalysis from './pages/UserAnalysis';
import TrendingExperiences from './pages/TrendingExperiences';
import AddExperiences from './pages/AddExperiences';
import CreatedExperiences from './pages/CreatedExperiences';
import Chat from './pages/Chat';
import Payment from './pages/Payment';
import Recommendation from './pages/Recommendation';
import Reviews from './pages/Reviews';
import GiveReview from './pages/GiveReview';
import ReviewManage from './pages/ReviewManage';
import Connections from './pages/Connections';
import FindPeople from './pages/FindPeople';
import Messages from './pages/Messages';
import DirectChat from './pages/DirectChat';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import { NotificationsProvider } from './contexts/NotificationsContext';
import './styles/connections.css';
import './styles/userDirectory.css';
import './styles/directChat.css';

export default function App() {
  return (
    <NotificationsProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/home" element={
          <RequireAuth>
            <Layout><Home /></Layout>
          </RequireAuth>
        } />
        <Route path="/browse" element={
          <RequireAuth>
            <Layout><Browse /></Layout>
          </RequireAuth>
        } />
        <Route path="/all-places" element={
          <RequireAuth>
            <Layout><AllPlaces /></Layout>
          </RequireAuth>
        } />
        <Route path="/suggest-places" element={
          <RequireAuth>
            <Layout><SuggestPlaces /></Layout>
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Layout><Dashboard /></Layout>
          </RequireAuth>
        } />
        <Route path="/payment" element={
          <RequireAuth>
            <Layout><Payment /></Layout>
          </RequireAuth>
        } />
        <Route path="/chat" element={
          <RequireAuth>
            <Layout><Chat /></Layout>
          </RequireAuth>
        } />
        <Route path="/trending" element={
          <RequireAuth>
            <Layout><TrendingExperiences /></Layout>
          </RequireAuth>
        } />
        <Route path="/recommendation" element={
          <RequireAuth>
            <Layout><Recommendation /></Layout>
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAuth>
            <Layout><AdminDashboard /></Layout>
          </RequireAuth>
        } />
        <Route path="/admin/reviews" element={
          <RequireAuth>
            <Layout><ReviewManage /></Layout>
          </RequireAuth>
        } />
        <Route path="/analysis" element={
          <RequireAuth>
            <Layout><Analysis /></Layout>
          </RequireAuth>
        } />
        <Route path="/analysis/:id" element={
          <RequireAuth>
            <Layout><UserAnalysis /></Layout>
          </RequireAuth>
        } />
        <Route path="/add-experiences" element={
          <RequireAuth>
            <Layout><AddExperiences /></Layout>
          </RequireAuth>
        } />
        <Route path="/created-experiences" element={
          <RequireAuth>
            <Layout><CreatedExperiences /></Layout>
          </RequireAuth>
        } />
        <Route path="/reviews" element={
          <RequireAuth>
            <Layout><Reviews /></Layout>
          </RequireAuth>
        } />
        <Route path="/give-review" element={
          <RequireAuth>
            <Layout><GiveReview /></Layout>
          </RequireAuth>
        } />
        <Route path="/connections" element={
          <RequireAuth>
            <Layout><Connections /></Layout>
          </RequireAuth>
        } />
        <Route path="/find-people" element={
          <RequireAuth>
            <Layout><FindPeople /></Layout>
          </RequireAuth>
        } />
        <Route path="/messages" element={
          <RequireAuth>
            <Layout><Messages /></Layout>
          </RequireAuth>
        } />
        <Route path="/direct-chat/:userId" element={
          <RequireAuth>
            <Layout><DirectChat /></Layout>
          </RequireAuth>
        } />
        <Route path="*" element={<div className="container"><h2>Page not found</h2></div>} />
      </Routes>
    </NotificationsProvider>
  );
}