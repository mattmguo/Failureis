import { createBrowserRouter } from "react-router";
import { StickyNotePage } from "./components/StickyNotePage";
import { WorkbookPage } from "./components/WorkbookPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StickyNotePage,
  },
  {
    path: "/workbook",
    Component: WorkbookPage,
  },
], { basename: "/Failureis/" });
