import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IProduct } from "../types/product.tying";

interface IProductGridProps {
  products: IProduct[];
  handleClickEditBtn: (id: number) => void;
}

const ProductGrid = ({ products, handleClickEditBtn }: IProductGridProps) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "code", headerName: "Code", width: 80 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "brand", headerName: "Brand", width: 100 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          aria-label="edit"
          size="small"
          color="secondary"
          style={{ marginRight: 8 }}
          onClick={() => handleClickEditBtn(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box className="grid" sx={{ p: 2 }}>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pagination
        pageSizeOptions={[10, 15, 20, 25]}
        getRowId={(row) => row.id}
        rowHeight={50}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default ProductGrid;
