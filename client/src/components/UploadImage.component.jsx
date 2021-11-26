import React from "react";

const UploadImage = ({ embryo_id, url, index, uploadFile }) => (
  <div style={{ margin: "5px 0px" }}>
    <input type="file" id={`upload${index}`} accept="image/*" />
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <button style={{ margin: "5px" }} onClick={() => uploadFile(index)}>
        アップロード
      </button>
      <span style={{ fontSize: "20px", color: "rgb(98, 8, 121)" }}>
        {`#${embryo_id[index]}`}
      </span>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      {url[index] && (
        <img style={{ width: "280px" }} alt="embryo" src={url[index]} />
      )}
    </div>
  </div>
);

export default UploadImage;
