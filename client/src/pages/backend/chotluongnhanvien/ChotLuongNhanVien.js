import React from "react";
import DanhSachChotLuongNhanVien from "./DanhSachChotLuongNhanVien";
import Host from "../../../hosts/Host";
function ChotLuongNhanVien() {
  const [DuLieu, SetDuLieu] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Host.ChotLuongNhanVien);
        SetDuLieu(await response.json());
      } catch (error) {}
    };
    fetchData();
  }, []);
  console.log(DuLieu);
  return (
    <React.Fragment>
      <h1 className="text-center mt-5 mb-4">CHỐT LƯƠNG</h1>
      <DanhSachChotLuongNhanVien
        DSChotLuongNhanVien={DuLieu}
      ></DanhSachChotLuongNhanVien>
    </React.Fragment>
  );
}

export default ChotLuongNhanVien;
