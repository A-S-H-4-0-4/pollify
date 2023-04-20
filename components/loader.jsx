
// styles
import { Box, CircularProgress} from "@mui/material";

 const  Loader = () => {
  return (
    <Box sx={{ display: 'flex',zIndex:"300",background: "  background: rgba(36, 30, 22, 0.2);",height: "100vh",width: "100vw",top: "0",left: "0",right: "0",bottom: "0",display:"flex",align: "center",justifyContent: "center"}}>
      <CircularProgress />
    </Box>
  )
}

export default Loader;


