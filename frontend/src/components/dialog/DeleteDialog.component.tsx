import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close, ErrorOutline } from "@mui/icons-material";

interface IDeleteDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  item: string;
}

const DeleteDialog = ({
  isOpen,
  handleClose,
  handleConfirm,
  item,
}: IDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle textTransform={"capitalize"}>
          Confirm Delete {item}
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleClose} sx={{ mr: 2 }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Typography gutterBottom>
          Are you sure you want to delete this {item}?
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <ErrorOutline sx={{ fontSize: "4rem", color: "#ccc" }} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Button
          onClick={handleClose}
          color="primary"
          variant="outlined"
          size="small"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          size="small"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
