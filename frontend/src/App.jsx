import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './components/common/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import PublicNewsPage from './pages/public/NewsPage'

import AdminDashboardPage from './pages/admin/Dashboard'
import BooksPage from './pages/admin/books/BooksPage'
import CategoriesPage from './pages/admin/categories/CategoriesPage'
import StudentsPage from './pages/admin/students/StudentsPage'
import LibrariansPage from './pages/admin/librarians/LibrariansPage'
import IssuesPage from './pages/admin/issues/IssuesPage'
import ComplaintsPage from './pages/admin/complaints/ComplaintsPage'
import FeedbackPage from './pages/admin/feedback/FeedbackPage'
import NewsPage from './pages/admin/news/NewsPage'
import ReportsPage from './pages/admin/reports/ReportsPage'
import SettingsPage from './pages/admin/settings/SettingsPage'

import LibrarianDashboardPage from './pages/protected/LibrarianDashboardPage'
import StudentDashboardPage from './pages/protected/StudentDashboardPage'
import StudentBooksPage from './pages/protected/StudentBooksPage'
import StudentIssuedBooksPage from './pages/protected/StudentIssuedBooksPage'
import StudentBorrowHistoryPage from './pages/protected/StudentBorrowHistoryPage'
import StudentNewsPage from './pages/protected/StudentNewsPage'
import StudentComplaintsPage from './pages/protected/StudentComplaintsPage'
import StudentFeedbackPage from './pages/protected/StudentFeedbackPage'
import StudentProfilePage from './pages/protected/StudentProfilePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/news" element={<PublicNewsPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/librarians"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LibrariansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issues"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <IssuesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <NewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/librarian/dashboard"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <LibrarianDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/books"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <BooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/issues"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <IssuesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/news"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <StudentNewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/students"
            element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/books"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/issued-books"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentIssuedBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/borrow-history"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentBorrowHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/news"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentNewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/feedback"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentFeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
