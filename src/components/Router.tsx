import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import LearnPage from '@/components/pages/LearnPage';
import BattleArenaPage from '@/components/pages/BattleArenaPage';
import StudyGuildsPage from '@/components/pages/StudyGuildsPage';
import ShopPage from '@/components/pages/ShopPage';
import LeaderboardPage from '@/components/pages/LeaderboardPage';
import AchievementsPage from '@/components/pages/AchievementsPage';
import AnimeReelsPage from '@/components/pages/AnimeReelsPage';
import AnimeWorldPage from '@/components/pages/AnimeWorldPage';
import StoryArcsPage from '@/components/pages/StoryArcsPage';
import EpisodeProgressionPage from '@/components/pages/EpisodeProgressionPage';
import MultiversePage from '@/components/pages/MultiversePage';
import CharacterFlashbackPage from '@/components/pages/CharacterFlashbackPage';
import MangaStoryPage from '@/components/pages/MangaStoryPage';
import AdvancedLearningPage from '@/components/pages/AdvancedLearningPage';
import SettingsPage from '@/components/pages/SettingsPage';

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
            <BattleArenaPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "guilds",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to join guilds">
            <StudyGuildsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "shop",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access the shop">
            <ShopPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view leaderboard">
            <LeaderboardPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "achievements",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view achievements">
            <AchievementsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "reels",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to watch anime reels">
            <AnimeReelsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "anime-world",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to explore the anime world">
            <AnimeWorldPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "story-arcs",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to explore story arcs">
            <StoryArcsPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "episode-progression",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view episode progression">
            <EpisodeProgressionPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "multiverse",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access the multiverse">
            <MultiversePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "character-flashback",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view character flashbacks">
            <CharacterFlashbackPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "manga-story",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to read manga stories">
            <MangaStoryPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "advanced-learning",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access advanced learning features">
            <AdvancedLearningPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access settings">
            <SettingsPage />
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
