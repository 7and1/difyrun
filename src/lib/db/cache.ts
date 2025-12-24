import { unstable_cache } from "next/cache";
import { getPopularTags } from "./index";

export const getCachedPopularTags = unstable_cache(
  async (categoryId?: string, limit = 20) => {
    return getPopularTags(categoryId, limit);
  },
  ["popular-tags"],
  {
    revalidate: 900,
  },
);
