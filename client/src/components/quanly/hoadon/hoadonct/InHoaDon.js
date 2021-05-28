import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
const InHoaDon = () => {
  let hi = useHistory();
  const { id } = useParams();
  useEffect(() => {
    window.print();
    hi.push(`/quan-ly/phong/hoa-don/${id}`);
  });
  return <div>AAA</div>;
};

export default InHoaDon;
