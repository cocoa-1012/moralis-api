import React from "react";
import Loader from "react-js-loader";

export const Loadercomponent = () => {
  return (
    <div>
      <Loader
        type="spinner-cub"
        bgColor={"#ffffff"}
        title={"loading"}
        color={"#ffffff"}
        size={100}
      />
    </div>
  );
};
