import React from "react";
import MUIDataTable from "mui-datatables";

const data = new Date();
var ngay_gio_hien_tai =
  data.toString().split(" ")[0] +
  " " +
  data.toString().split(" ")[2] +
  "-" +
  data.toString().split(" ")[1] +
  " " +
  data.toString().split(" ")[3];

function DachSachChotLuongNhanVien({ DSChotLuongNhanVien }) {
  const options = {
    filter: true,
    filterType: "checkbox",
    responsive: "standard",
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    print: true,
    viewColumns: true,
    download: true,
    downloadOptions: {
      filename: "Luong(" + ngay_gio_hien_tai + ").csv",
      filterOptions: {
        useDisplayedRowsOnly: true,
        useDisplayedColumnsOnly: true,
      },
    },
  };

  const columns = [
    {
      name: "ma_nhan_vien",
      label: "Mã nhân viên",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Tên nhân viên",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "ngay",
      label: "Ngày",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "ngay_ca_lam_viec",
      label: "Lịch làm việc",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "gio_vao",
      label: "Giờ vào",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "gio_ra",
      label: "Giờ ra",
      options: {
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "gio_cong",
    //   label: "Giờ công",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
  ];
  return (
    <React.Fragment>
      <div className="mt-5">
        <MUIDataTable
          title={""}
          data={DSChotLuongNhanVien}
          columns={columns}
          options={options}
        />
      </div>
    </React.Fragment>
  );
}

export default DachSachChotLuongNhanVien;
