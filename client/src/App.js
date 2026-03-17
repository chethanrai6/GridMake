import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Editor from './components/Editor/Editor';
import HomePage from './components/Home/HomePage';
import BlogPage from './components/Blog/BlogPage';
import BlogPost from './components/Blog/BlogPost';
import BlogEditor from './components/Blog/BlogEditor';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/new" element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                } />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog/:id/edit" element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                } />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editor/:projectId?" 
                  element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;