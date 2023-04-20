
// styles
import { Box, CircularProgress} from "@mui/material";

 const  Loader = () => {
  return (
    <Box sx={{ display: 'flex',zIndex:"100",background: "transparent",height: "100vh",width: "100vw",top: "0",left: "0",right: "0",bottom: "0"}}>
      <CircularProgress />
    </Box>
  )
}

export default Loader;


