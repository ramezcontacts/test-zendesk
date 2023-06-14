import FadeLoader from "react-spinners/FadeLoader";

function Loader(props) {
  return (
    <div className="main-loader">
      <center>
      {props.text ? <p>{props.text}</p>:""}
      <FadeLoader size={props.size} color={props.color} />
      </center>
    </div>
  );
}

export default Loader;
