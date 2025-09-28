import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import LearnPage from '@/components/pages/LearnPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      {
        index: true,
        element: <HomePage />, // MIXED ROUTE: Shows different content for authenticated vs anonymous users
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your dashboard">
            <DashboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "learn",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access learning modules">
            <LearnPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "battle",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to enter the battle arena">
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-heading font-black text-primary mb-4">Battle Arena</h1>
                <p className="text-xl font-paragraph text-light-gray">Coming Soon - Epic boss battles await!</p>
              </div>
            </div>
          </MemberProtectedRoute>
        ),
      },
      {
        path: "guilds",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to join guilds">
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-heading font-black text-primary mb-4">Study Guilds</h1>
                <p className="text-xl font-paragraph text-light-gray">Coming Soon - Form alliances with fellow learners!</p>
              </div>
            </div>
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
