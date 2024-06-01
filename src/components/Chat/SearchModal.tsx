import React from "react";
import Image from "next/image";
import { Button, Typography, Modal, Box } from "@mui/material";
import SearchIcon from "../../images/search-icon.png";
import SearchPage from "./SearchPage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "85%",
  height: "85%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
  overflowY: "auto",
};

const SearchModal = () => {
  const [modalOpen, setmodalOpen] = React.useState(false);
  const handleOpen = () => {
    setmodalOpen(true);
  };
  const handleClose = () => {
    setmodalOpen(false);
  };

  return (
    <div>
      <Button
        sx={{
          display: "flex",
          borderRadius: "10px",
          border: "2px solid rgb(218, 226, 237)",
          cursor: "pointer",
          width: "17rem",
          height: "2.5rem",
        }}
        onClick={handleOpen}
      >
        <Image
          src={SearchIcon}
          style={{ width: "14px", height: "14px", marginRight: "auto" }}
          alt={""}
        />
        <Typography style={{ marginRight: "auto" }}>
          Search [Experimental]
        </Typography>
      </Button>
      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={style}>
          <SearchPage></SearchPage>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchModal;
