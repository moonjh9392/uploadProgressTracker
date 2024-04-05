import Box from "@mui/material/Box";
import ModalOriginal from "@mui/material/Modal";

const Modal = (props) => {
  const { isOpen, handleClose, children } = props;

  const modalStyle = {
    border: "none",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    background: "#FFFFFF",

    borderRadius: "16px",
    // border: '1px solid #D2D2D2',
    boxShadow: "0px 5px 20px 0px #0000001F",
  };

  return (
    <ModalOriginal
      onWheel={(e) => e.stopPropagation()}
      open={isOpen}
      onClose={handleClose}
      sx={{
        ...modalStyle,
        "& .MuiBackdrop-root": { backgroundColor: "rgba(34, 34, 34, 0.6)" },
      }}
    >
      <Box sx={{ ...style, outline: "none" }}>{children}</Box>
    </ModalOriginal>
  );
};

export default Modal;
