import LoadingOverlay from "react-loading-overlay";
import Image from "next/image";
import loading from "./../public/loading.gif";

const DarkBackground=(props)=>{
    return(<div className="loader" style={{display:props.dissapear?'none':'block'}}>
        {/* <LoadingOverlay
          active={true}
          spinner={true}
          text="Loading..."
        >{props.children}</LoadingOverlay> */}
        <Image src={loading} alt="loading..." />

    </div>)
};

export default DarkBackground;