import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { AnalysisProgress } from "./pages/AnalysisProgress";
import { AnalysisResult } from "./pages/AnalysisResult";
import { MyPage } from "./pages/MyPage";
import { KeywordRanking } from "./pages/KeywordRanking";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/analysis/:placeId",
    Component: AnalysisProgress,
  },
  {
    path: "/result/:placeId",
    Component: AnalysisResult,
  },
  {
    path: "/mypage",
    Component: MyPage,
  },
  {
    path: "/keyword-ranking",
    Component: KeywordRanking,
  },
]);
