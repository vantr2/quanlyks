import React from "react";

const XoaHoaDon = ({ id }) => {
  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        // data-toggle="modal"
        // data-target={`#id${id}xoa`}
        // onClick={fetchData}
      >
        &nbsp;Xóa
      </i>
    </div>
  );
};

export default XoaHoaDon;
