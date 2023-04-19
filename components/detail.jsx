// style
import D from "../styles/components/detail.module.css";

// mui icons
import CloseIcon from '@mui/icons-material/Close';

const Detail = ({ callback, topic, details }) => {


  return (
    <div className={D.glass}>
      <CloseIcon color="error" sx={{ marginLeft: "95%", cursor: "pointer", marginTop: "20px", fontSize: "30px" }} onClick={callback} />
      <div className={D.container}>
        <h1 className={D.topic}>{topic}</h1>
        {details && details.map((object) => {
          return <p className={D.details}>{object}</p>;
        })}
      </div>
    </div>
  );
}

export default Detail