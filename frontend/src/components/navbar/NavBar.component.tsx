import { Link } from "react-router-dom";
import {
  AppBar,
  List,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";

const menuItems = [
  {
    label: "Product",
    link: "product",
  },
  {
    label: "Brand",
    link: "brand",
  },
];

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "steelblue" }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {menuItems.map((item, index) => (
          <List key={index}>
            {item.link ? (
              <ListItemButton component={Link} to={item.link}>
                <Typography
                  textTransform={"uppercase"}
                  fontSize={20}
                  fontFamily={"sans-serif"}
                >
                  {item.label}
                </Typography>
              </ListItemButton>
            ) : (
              <ListItemButton>{item.label}</ListItemButton>
            )}
          </List>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
