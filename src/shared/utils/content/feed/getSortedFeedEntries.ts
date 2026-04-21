import type { FeedEntry } from "./types";
import { SITE } from "@config";

const MS_PER_SECOND = 1000;

const getEntryTimestamp = (entry: FeedEntry) => {
  const datetime = entry.data.modDatetime ?? entry.data.pubDatetime;
  return Math.floor(new Date(datetime).getTime() / MS_PER_SECOND);
};

const feedFilter = (entry: FeedEntry) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(entry.data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  return !entry.data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export const getSortedFeedEntries = (entries: FeedEntry[]) =>
  entries.filter(feedFilter).sort((a, b) => getEntryTimestamp(b) - getEntryTimestamp(a));
