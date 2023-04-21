
// styles
import { Box, CircularProgress} from "@mui/material";

 const  Loader = () => {
  return (
    <Box sx={{ display: 'flex',backgroundColor: "transparent",height: "100vh",width: "100vw",top: "0",left: "0",right: "0",bottom: "0",alignItems: "center",justifyContent: "center",position: "fixed",zIndex:300}}>
      <CircularProgress />
    </Box>
  )
}

export default Loader;


