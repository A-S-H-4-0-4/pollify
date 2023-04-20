
// styles
import { Box, CircularProgress} from "@mui/material";

 const  Loader = () => {
  return (
    <Box sx={{ display: 'flex',zIndex:"100" }}>
      <CircularProgress />
    </Box>
  )
}

export default Loader;


