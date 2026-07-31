const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Slices an already-filtered/sorted array into a page.
 * Clamps page >= 1 and 1 <= pageSize <= 100 defensively, even though the
 * zod query schemas upstream should already guarantee that.
 */
export function paginate(rows, { page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  let safePage = Math.max(1, Math.trunc(Number(page)) || 1);
  let safePageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(Number(pageSize)) || DEFAULT_PAGE_SIZE));
  let start = (safePage - 1) * safePageSize;
  let total = rows.length;

  return {
    data: rows.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}
