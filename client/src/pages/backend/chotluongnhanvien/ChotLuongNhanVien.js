import React from "react";
import DanhSachChotLuongNhanVien from "./DanhSachChotLuongNhanVien";
import Host from "../../../hosts/Host";
function ChotLuongNhanVien() {
  const [DuLieu, SetDuLieu] = React.useState([]);
  const [MangMaNV, SetMangMaNV] = React.useState([]);
  const [TenNV, SetTenNV] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(Host.ChotLuongNhanVien);
        const JsonData = await response.json();
        SetDuLieu(JsonData);
        const manv = [];
        const tennv = [];
        // console.log(JsonData);
        JsonData.map((x, index) => {
          if (manv.indexOf(x.ma_nhan_vien) >= 0) {
          } else {
            manv.push(x.ma_nhan_vien);
            tennv.push(x.name);
          }
          return null;
        });

        SetTenNV(tennv);
        console.log(tennv);
        SetMangMaNV(manv);
      } catch (error) {}
    };
    fetchData();
  }, []);
  //   console.log(DuLieu);

  //   const conver_giocong = (giocong) => {
  //     return (
  //       parseFloat(giocong.split(":")[0]) + parseFloat(giocong.split(":")[1] / 60)
  //     );
  //   };

  //   const handlePrintByMonth = () => {
  //     var divToPrint = document.getElementById("InThongKeChotLuong");

  //     var newWin = window.open("", "Print-Window");

  //     newWin.document.open();

  //     newWin.document.write(
  //       `
  //     <!doctype html>
  //     <html lang="en">
  //       <head>
  //         <title>Title</title>
  //         <!-- Required meta tags -->
  //         <meta charset="utf-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  //         <!-- Bootstrap CSS -->
  //         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  //         <style>
  //             #nut-click-ban{
  //                 display:none;
  //             }
  //           .form-control {
  //               border: none;
  //           }
  //           .title{
  //             text-align: center;
  //             font-size: 40px;
  //             font-weight: bold;
  //           }
  //                   .limiter {
  //             width: 100%;
  //             margin: 0 auto;
  //           }

  //             .container-table100 {
  //               width: 100%;
  //               min-height: 100vh;
  //               background:white;

  //               display: -webkit-box;
  //               display: -webkit-flex;
  //               display: -moz-box;
  //               display: -ms-flexbox;
  //               display: flex;
  //               /*align-items: center;*/
  //               justify-content: center;
  //               flex-wrap: wrap;
  //               padding: 33px 30px;
  //             }

  //             .wrap-table100 {
  //               width: 1170px;
  //             }

  //             table {
  //               border-spacing: 1;
  //               border-collapse: collapse;
  //               background: white;
  //               overflow: hidden;
  //               width: 100%;
  //               margin: 0 auto;
  //               position: relative;
  //               border: 1px solid;
  //             }
  //             table * {
  //               position: relative;
  //             }
  //             table td, table th {
  //               padding-left: 8px;
  //               border: 1px solid;
  //             }
  //             table thead tr {
  //               font-weight: bold;
  //                 height: 60px;
  //               background: white;
  //             }
  //             table tbody tr {
  //               height: 50px;
  //             }
  //             table tbody tr:last-child {
  //               border: 0;
  //             }
  //             table td, table th {
  //               text-align: left;
  //             }
  //             table td.l, table th.l {
  //               text-align: right;
  //             }
  //             table td.c, table th.c {
  //               text-align: center;
  //             }
  //             table td.r, table th.r {
  //               text-align: center;
  //             }

  //             .table100-head th{
  //               font-family: OpenSans-Regular;
  //               font-size: 18px;
  //               color:black;
  //               font-weight: bold;
  //               line-height: 1.2;
  //               font-weight: unset;
  //               border: 1px solid;
  //             }

  //             tbody tr:nth-child(even) {
  //               background-color: #f5f5f5;
  //             }

  //             tbody tr {
  //               font-family: OpenSans-Regular;
  //               font-size: 15px;
  //               color: #808080;
  //               line-height: 1.2;
  //               font-weight: unset;
  //             }

  //             tbody tr:hover {
  //               color: #555555;
  //               background-color: #f5f5f5;
  //               cursor: pointer;
  //             }

  //             .column1 {
  //               width: 160px;
  //             }

  //             .column2 {
  //               width: 160px;
  //             }

  //             .column3 {
  //               width: 245px;
  //               text-align: center;
  //             }

  //             .column4 {
  //               width: 110px;
  //               text-align: left;
  //             }

  //             .column5 {
  //               width: 170px;
  //               text-align: right;
  //             }

  //             .column6 {
  //               width: 222px;
  //               text-align: right;

  //             }

  //             @media screen and (max-width: 992px) {
  //               table {
  //                 display: block;
  //               }
  //               table > *, table tr, table td, table th {
  //                 display: block;
  //               }
  //               table thead {
  //                 display: none;
  //               }
  //               table tbody tr {
  //                 height: auto;
  //                 padding: 37px 0;
  //               }
  //               table tbody tr td {
  //                 padding-left: 40% !important;
  //                 margin-bottom: 24px;
  //               }
  //               table tbody tr td:last-child {
  //                 margin-bottom: 0;
  //               }
  //               table tbody tr td:before {
  //                 font-family: OpenSans-Regular;
  //                 font-size: 14px;
  //                 color: #999999;
  //                 line-height: 1.2;
  //                 font-weight: unset;
  //                 position: absolute;
  //                 width: 40%;
  //                 left: 30px;
  //                 top: 0;
  //               }
  //               table tbody tr td:nth-child(1):before {
  //                 content: "Date";
  //               }
  //               table tbody tr td:nth-child(2):before {
  //                 content: "Order ID";
  //               }
  //               table tbody tr td:nth-child(3):before {
  //                 content: "Name";
  //               }
  //               table tbody tr td:nth-child(4):before {
  //                 content: "Price";
  //               }
  //               table tbody tr td:nth-child(5):before {
  //                 content: "Quantity";
  //               }
  //               table tbody tr td:nth-child(6):before {
  //                 content: "Total";
  //               }

  //               .column4,
  //               .column5,
  //               .column6 {
  //                 text-align: left;
  //               }

  //               .column4,
  //               .column5,
  //               .column6,
  //               .column1,
  //               .column2,
  //               .column3 {
  //                 width: 100%;
  //               }

  //               tbody tr {
  //                 font-size: 14px;
  //               }
  //             }
  //             .nhanvien{
  //               font-size: 20px;
  //               font-weight: bold;
  //               float: right;
  //               padding: 30px;
  //               padding-right: 100px;
  //              }
  //             .giamdoc{
  //               font-size: 20px;
  //               float: left;
  //               font-weight: bold;
  //               padding: 30px;
  //               padding-left: 100px;
  //             }
  //             @media (max-width: 576px) {
  //               .container-table100 {
  //                 padding-left: 15px;
  //                 padding-right: 15px;
  //               }
  //             }
  //         </style>
  //         </head>
  //       <body onload="window.print()">
  //       ` +
  //         divToPrint.innerHTML +
  //         `
  //         <!-- Optional JavaScript -->
  //         <!-- jQuery first, then Popper.js, then Bootstrap JS -->

  //       </body>
  //     </html>`
  //     );

  //     newWin.document.close();

  //     setTimeout(function () {
  //       newWin.close();
  //     }, 3000);
  //   };
  return (
    <React.Fragment>
      <h1 className="text-center mt-5 mb-5">CHỐT LƯƠNG</h1>

      <div className="d-flex flex-row ">
        {/* <button
          type="button"
          className="btn btn-info"
          onClick={handlePrintByMonth}
          id="nut-click-chi"
        >
          In bảng lương
        </button> */}
      </div>
      <DanhSachChotLuongNhanVien
        DSChotLuongNhanVien={DuLieu}
      ></DanhSachChotLuongNhanVien>

      <div className="container-table100" id="InThongKeChotLuong" hidden>
        <div className="wrap-table100">
          <div className="table100">
            <div className="title">Bảng chấm công</div>
            <table>
              <thead>
                <tr className="table100-head">
                  <th className="column2" rowSpan="2">
                    STT
                  </th>
                  <th className="column2" rowSpan="2">
                    Mã NV
                  </th>
                  <th className="column3" rowSpan="2">
                    Họ và tên
                  </th>
                  <th className="column3" colSpan="31">
                    Ngày chấm công trong tháng
                  </th>
                  <th className="column4" rowSpan="2">
                    Công hưởng lương
                  </th>
                </tr>
                <tr>
                  <td className="column2">1</td>
                  <td className="column2">2</td>
                  <td className="column2">3</td>
                  <td className="column2">4</td>
                  <td className="column2">5</td>
                  <td className="column2">6</td>
                  <th className="column2">7</th>
                  <td className="column2">8</td>
                  <td className="column2">9</td>
                  <td className="column2">10</td>
                  <td className="column2">11</td>
                  <td className="column2">12</td>
                  <td className="column2">13</td>
                  <td className="column2">14</td>
                  <td className="column2">15</td>
                  <td className="column2">16</td>
                  <td className="column2">17</td>
                  <td className="column2">18</td>
                  <th className="column2">19</th>
                  <td className="column2">20</td>
                  <td className="column2">21</td>
                  <td className="column2">22</td>
                  <td className="column2">23</td>
                  <td className="column2">24</td>
                  <td className="column2">25</td>
                  <td className="column2">26</td>
                  <th className="column2">27</th>
                  <td className="column2">28</td>
                  <td className="column2">29</td>
                  <td className="column2">30</td>
                  <td className="column2"></td>
                </tr>
              </thead>
              <tbody>
                {MangMaNV.map((x, index) => (
                  <tr key={index}>
                    <th className="column1" scope="row">
                      {index}
                    </th>
                    <td>{x}</td>
                    <td className="column2">{TenNV[index]}</td>
                    {/* {DuLieu.map((z) => {
                      if (z.ma_nhan_vien === x) {
                        const giocong = [];
                        for (let i = 1; i <= 30; i++) {
                          if (new Date(z.ngay).getMonth() + 1 === i) {
                            giocong.push(z.gio_cong);
                          } else {
                            giocong.push(0);
                          }
                        }
                        console.log(giocong);
                      }
                      return null;
                    })} */}

                    {/* <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <th className="column2">{Math.floor(Math.random() * 10)}</th>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <th className="column2">{Math.floor(Math.random() * 10)}</th>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <th className="column2">{Math.floor(Math.random() * 10)}</th>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{Math.floor(Math.random() * 10)}</td>
                    <td className="column2">{""}</td>
                    <td className="column2">
                      {Math.floor(Math.random(1) * 10) * 30}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="nhanvien">Nhân viên</div>
            <div className="giamdoc">Giám đốc</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ChotLuongNhanVien;
