import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { AnalysisProgress } from "./pages/AnalysisProgress";
import { AnalysisResult } from "./pages/AnalysisResult";
import { KeywordRanking } from "./pages/KeywordRanking";

export const router = createBrowserRouter([
  {
    path: "/",
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
    path: "/keyword-ranking/:placeId",
    Component: KeywordRanking,
  },
]);