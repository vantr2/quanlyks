import React from "react";

const SuaHoaDon = ({ id }) => {
  return (
    <div>
      <i
        className="fas fa-trash text-warning"
        // data-toggle="modal"
        // data-target={`#id${id}xoa`}
        // onClick={fetchData}
      >
        &nbsp;Sửa
      </i>
    </div>
  );
};

export default SuaHoaDon;
