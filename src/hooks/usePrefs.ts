import { useSyncExternalStore } from "react";
import { prefsStore } from "../stores/prefs.store";

export function usePrefs() {
  const state = useSyncExternalStore(
    prefsStore.subscribe,
    prefsStore.getSnapshot,
  );

  return {
    viewMode: state.viewMode,
    setViewMode: prefsStore.setViewMode,
    isGridMode: state.viewMode === "grid",
    isListMode: state.viewMode === "list",
  };
}
