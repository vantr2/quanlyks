import React from "react";
import QrReader from "react-qr-reader";
import Host from "../../../hosts/Host";
function CheckVaoRaNhanVien() {
  const [data, setData] = React.useState("Not found");
  const [check, Setcheck] = React.useState(true);
  const handleError = (e) => {
    console.log(e);
  };
  const handleScan = async (e) => {
    try {
      if (e != null) {
        const date = new Date();
        var ngay_gio_hien_tai =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
        const response = await fetch(Host.CheckRaVaoNhanVien, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ngay_gio_hien_tai, e, check }),
        });

        setData(await response.json());
      }
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <h1 className="text-center mt-5 mb-4">VÀO RA NHÂN VIÊN</h1>

      <div className="content">
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <strong className="card-title">
                    Check ca ra vào nhân viên
                  </strong>
                </div>
                <div className="card-body">
                  {/* Credit Card */}
                  <div className="row">
                    <div className="col"></div>
                    <div className="col">
                      <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: "300px", height: "300px" }}
                      />
                      <p>{data}</p>
                      <input
                        type="radio"
                        checked={check}
                        style={check ? { zoom: "1.5" } : { zoom: "1.2" }}
                        onClick={async () => Setcheck(true)}
                      ></input>
                      <label
                        style={{ fontSize: "18px" }}
                        onClick={async () => Setcheck(true)}
                      >
                        {" "}
                        Nhân viên đi vào
                      </label>
                      <br></br>
                      <input
                        type="radio"
                        checked={!check}
                        style={!check ? { zoom: "1.5" } : { zoom: "1.2" }}
                        onClick={async () => Setcheck(false)}
                      ></input>
                      <label
                        style={{ fontSize: "18px" }}
                        onClick={async () => Setcheck(false)}
                      >
                        {" "}
                        Nhân viên đi ra
                      </label>
                    </div>
                    <div className="col"></div>
                  </div>
                  <div className="row"></div>
                </div>
              </div>{" "}
              {/* .card */}
            </div>
            {/*/.col*/}
          </div>
        </div>
        {/* .animated */}
      </div>
      {/* .content */}
    </React.Fragment>
  );
}

export default CheckVaoRaNhanVien;
