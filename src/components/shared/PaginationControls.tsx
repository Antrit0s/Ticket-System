import { Box, Pagination } from "@mui/material";

interface Props {
  total: number;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  total,
  currentPage,
  pageSize = 8,
  onPageChange,
}: Props) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={(_event, page) => onPageChange(page)}
        color="primary"
        size="large"
      />
    </Box>
  );
}
