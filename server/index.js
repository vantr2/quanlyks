require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const db = require("./db");

const app = express();
const accessLogStream = fs.createWriteStream("./log/access.log", {
  flags: "a",
});

// setup the logger

// const multipart = require("connect-multiparty");
// const multipartMiddleware = multipart({ uploadDir: "./images" });

const { encrypt, decrypt } = require("./EncrytionHandle");

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is starting by port ${port}`);
});

// middle ware
app.use(express.json());

app.use(
  morgan(":date[web] :method :url :status :response-time ms", {
    stream: accessLogStream,
  })
);
app.use(cors());

//#region NguoiDung va DangNhap
// Kiem tra nguoi dung backend
app.post("/api/v1/kiem-tra-dang-nhap-backend", async (req, res) => {
  try {
    const { ten, mk, vaitro } = req.body;

    const passAndiv = await db.query(
      "select mk,iv from tbl_nguoidung where ten = $1",
      [ten]
    );
    const encryption = {
      iv: passAndiv.rows[0].iv,
      password: passAndiv.rows[0].mk,
    };
    const checkpass = decrypt(encryption);
    if (mk === checkpass) {
      const result = await db.query(
        "select ten,ten_hienthi,vaitro,avt from tbl_nguoidung where ten=$1 and trangthai='t' and vaitro <> $2",
        [ten, vaitro]
      );

      res.status(200).json({
        status: "ok",
        data: {
          ten: result.rows[0].ten,
          ten_ht: result.rows[0].ten_hienthi,
          vaitro: result.rows[0].vaitro,
          avt: result.rows[0].avt,
        },
      });
    } else {
      res.json({
        status: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
  } catch (err) {
    res.json({
      status: "Tài khoản hoặc mật khẩu không chính xác",
    });
    console.error("Kiem tra dang nhap: " + err.message);
  }
});

//Them tai khoan
app.post("/api/v1/tai-khoan/them-tai-khoan", async (req, res) => {
  try {
    const { ten, mk, ten_hienthi, vaitro } = req.body;
    const hashedPassword = encrypt(mk);
    const result = await db.query(
      "insert into tbl_nguoidung (ten, mk, ten_hienthi, trangthai, vaitro, iv) values($1,$2,$3,'f',$4,$5) returning *",
      [ten, hashedPassword.password, ten_hienthi, vaitro, hashedPassword.iv]
    );

    res.status(201).json({
      status: "ok",
      data: {
        acc: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them nguoi dung:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "tbl_nguoidung_pkey"'
    ) {
      res.json({
        status: "Tên người dùng đã tồn tại !",
      });
    }
  }
});

app.post("/api/v1/tai-khoan/them-tai-khoan-khach-hang", async (req, res) => {
  try {
    const { ten, mk, ten_hienthi } = req.body;
    const hashedPassword = encrypt(mk);
    const result = await db.query(
      "insert into tbl_nguoidung (ten, mk, ten_hienthi, trangthai, vaitro, iv) values($1,$2,$3,'t','KH',$4) returning *",
      [ten, hashedPassword.password, ten_hienthi, hashedPassword.iv]
    );

    res.status(201).json({
      status: "ok",
      data: {
        acc: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them nguoi dung:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "tbl_nguoidung_pkey"'
    ) {
      res.json({
        status: "Tên người dùng đã tồn tại !",
      });
    }
  }
});

// Lay danh sach nguoi dung
app.get("/api/v1/tai-khoan/danh-sach-nguoi-dung", async (req, res) => {
  try {
    const result = await db.query(
      "select ten,mk,ten_hienthi,trangthai,vaitro from tbl_nguoidung where ten <> $1 order by vaitro asc",
      ["trongvan"]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nguoidung: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach nguoi dung" + err.message);
  }
});

// lay thong tin 1 nguoi dung
app.get("/api/v1/tai-khoan/thong-tin-nguoi-dung/:ten", async (req, res) => {
  try {
    const { ten } = req.params;
    const result = await db.query(
      "select ten,mk,ten_hienthi,trangthai,vaitro from tbl_nguoidung where ten <> $1 and ten = $2",
      ["trongvan", ten]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nguoidung: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach nguoi dung" + err.message);
  }
});

// loc ten nguoi dung duoc cap quyen
app.get("/api/v1/tai-khoan/loc-nguoi-dung-duoc-cap-quyen", async (req, res) => {
  try {
    const result = await db.query(
      "select ten from tbl_nguoidung where ten <> $1 and trangthai = $2 and vaitro <> $3 order by ten asc",
      ["trongvan", "t", "KH"]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nguoidung: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach nguoi dung" + err.message);
  }
});

//sua thong tin co ban nguoi dung
app.put("/api/v1/tai-khoan/cap-nhat-thong-tin-nguoi-dung", async (req, res) => {
  try {
    const { ten, tenht, vaitro } = req.body;
    const result = await db.query(
      "update tbl_nguoidung set ten_hienthi = $1, vaitro=$2 where ten = $3 and ten <> $4",
      [tenht, vaitro, ten, "trongvan"]
    );
    res.status(200).json({
      status: "Sửa thành công.",
    });
  } catch (err) {
    console.log("Cap nhat thong tin nguoi dung" + err.message);
  }
});

// thay doi trang thai tai khoan
app.put(
  "/api/v1/tai-khoan/thay-doi-trang-thai-nguoi-dung",
  async (req, res) => {
    try {
      const { ten, trangthai } = req.body;
      const result = await db.query(
        "update tbl_nguoidung set trangthai = $1 where ten = $2 and ten <> $3",
        [trangthai, ten, "trongvan"]
      );
      res.status(200).json({
        status: "Thay đổi thành công",
      });
    } catch (err) {
      console.log("Thay doi trang thai nguoi dung" + err.message);
    }
  }
);

// reset mat khau
app.put("/api/v1/tai-khoan/cai-dat-lai-mat-khau", async (req, res) => {
  try {
    const { ten } = req.body;
    hashedPw = encrypt("12345678");
    const result = await db.query(
      "update tbl_nguoidung set mk = $1,iv=$2 where ten = $3 and ten <> $4",
      [hashedPw.password, hashedPw.iv, ten, "trongvan"]
    );
    res.status(200).json({
      status: "Cài đặt lại thành công",
    });
  } catch (err) {
    console.log("reset pw:" + err.message);
  }
});

// xoa tai khoan

app.delete("/api/v1/tai-khoan/xoa-tai-khoan/:ten", async (req, res) => {
  try {
    const { ten } = req.params;

    await db.query(
      "delete from tbl_nguoidung where ten = $1 and ten <> $2 and trangthai= $3",
      [ten, "trongvan", "f"]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa tài khoản:" + err.message);
  }
});

//lay avt
app.get("/api/v1/tai-khoan/get-avt/:ten", async (req, res) => {
  try {
    const { ten } = req.params;
    const result = await db.query(
      "select avt,filename from tbl_nguoidung where ten=$1",
      [ten]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nguoidung: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach nguoi dung" + err.message);
  }
});

//update avt
app.put("/api/v1/tai-khoan/update-avt", async (req, res) => {
  try {
    const { ten, avt, filename } = req.body;
    const result = await db.query(
      "update tbl_nguoidung set avt=$1,filename=$2 where ten=$3",
      [avt, filename, ten]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("update avt:" + err.message);
  }
});

//doi mat khau
app.put("/api/v1/tai-khoan/doi-mat-khau", async (req, res) => {
  try {
    const { ten, mk, iv, mkcu, mkmoi } = req.body;
    const encryption = {
      iv: iv,
      password: mk,
    };
    const real_mk = decrypt(encryption);
    if (real_mk === mkcu) {
      hashedPw = encrypt(mkmoi);
      const result = await db.query(
        "update tbl_nguoidung set mk = $1,iv=$2 where ten = $3 and ten <> $4",
        [hashedPw.password, hashedPw.iv, ten, "trongvan"]
      );
      res.status(200).json({
        status: "ok",
      });
    } else {
      res.status(200).json({
        status: "Mật khẩu cũ nhập vào không chính xác.",
      });
    }
  } catch (err) {
    console.log("change pw:" + err.message);
  }
});

// Kiem tra nguoi dung frontend
app.post("/api/v1/kiem-tra-dang-nhap-frontend", async (req, res) => {
  try {
    const result = await db.query(
      "select ten,ten_hienthi from tbl_nguoidung where ten=$1 and mk=$2 and trangthai=$3 and vaitro = $4",
      [req.body.ten, req.body.mk, req.body.trangthai, req.body.vaitro]
    );

    res.status(200).json({
      status: "ok",
      data: {
        ten: result.rows[0].ten,
        ten_ht: result.rows[0].ten_hienthi,
      },
    });
  } catch (err) {
    res.json({
      status: "Tài khoản hoặc mật khẩu không chính xác",
    });
  }
});

//#endregion

//#region NhanVien

//lay danh sách nhan vien
app.get("/api/v1/nhan-vien/danh-sach-nhan-vien", async (req, res) => {
  try {
    const result = await db.query(
      "select * from tbl_nhanvien order by name asc"
    );

    res.status(200).json({
      status: "ok",
      data: {
        nhanvien: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach nhan vien" + err.message);
  }
});
// lay 1 nhan vien bthg
app.get("/api/v1/nhan-vien/danh-sach-nhan-vien-xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from tbl_nhanvien where id = $1", [
      id,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        nhanvien: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 nhan vien de xoa: " + err.message);
  }
});

// lay 1 nhan vien chi tiet theo id nhan vien
app.get("/api/v1/nhan-vien/danh-sach-nhan-vien/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_nhanvieninfo where id = $1",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nhanvien: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 nhan vien theo id nhanvien: " + err.message);
  }
});

// lay 1 nhan vien theo acc nhan vien
app.get(
  "/api/v1/nhan-vien/danh-sach-nhan-vien-theo-acc/:acc",
  async (req, res) => {
    try {
      const { acc } = req.params;
      const result = await db.query(
        "select * from v_nhanvieninfo where account = $1",
        [acc]
      );

      res.status(200).json({
        status: "ok",
        data: {
          nhanvien: result.rows[0],
        },
      });
    } catch (err) {
      console.error("Lay 1 nhan vien theo acc: " + err.message);
    }
  }
);

//tim kiem nhan vien theo ten
app.get(
  "/api/v1/nhan-vien/tim-kiem-nhan-vien-theo-ten/:ten",
  async (req, res) => {
    try {
      const { ten } = req.params;
      const result = await db.query(
        "select * from tbl_nhanvien where name like $1",
        ["%" + ten + "%"]
      );

      res.status(200).json({
        status: "ok",
        data: {
          nhanvien: result.rows,
        },
      });
    } catch (err) {
      console.error("Tim kiem theo ten nhan vien: " + err.message);
    }
  }
);

//tim kiem nhan vien theo account
app.get(
  "/api/v1/nhan-vien/tim-kiem-nhan-vien-theo-acc/:acc",
  async (req, res) => {
    try {
      const { acc } = req.params;
      const result = await db.query(
        "select * from tbl_nhanvien where account like $1",
        ["%" + acc + "%"]
      );

      res.status(200).json({
        status: "ok",
        data: {
          nhanvien: result.rows,
        },
      });
    } catch (err) {
      console.error("Tim kiem theo ten acc: " + err.message);
    }
  }
);

//them nhan vien

app.post("/api/v1/nhan-vien/them-nhan-vien", async (req, res) => {
  try {
    const { ten, gioitinh, ngaysinh, diachi, cmnd, sdt, email, taikhoan } =
      req.body;
    const result = await db.query(
      "insert into tbl_nhanvien (name, gioitinh, ngaysinh, diachi, cmnd,sdt,email,account) values($1,$2,$3,$4,$5,$6,$7,$8 ) returning *",
      [ten, gioitinh, ngaysinh, diachi, cmnd, sdt, email, taikhoan]
    );

    res.status(201).json({
      status: "ok",
      data: {
        nhanvien: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them nhan vien:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "tbl_nhanvien_account_key"'
    ) {
      res.json({
        status:
          "Tài khoản này đã được cài đặt cho người khác, xin chọn tài khoản khác.",
      });
    }
  }
});

//sua nhan vien
app.put("/api/v1/nhan-vien/sua-nhan-vien", async (req, res) => {
  try {
    const { id, ten, gioitinh, ngaysinh, diachi, cmnd, sdt, email, taikhoan } =
      req.body;

    const result = await db.query(
      "update tbl_nhanvien set name=$1, gioitinh=$2, ngaysinh=$3, diachi=$4, cmnd=$5,sdt=$6,email=$7,account=$8 where id=$9",
      [ten, gioitinh, ngaysinh, diachi, cmnd, sdt, email, taikhoan, id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua nhan vien: " + err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "tbl_nhanvien_account_key"'
    ) {
      res.status(200).json({
        status:
          "Tài khoản bạn sửa đang được người khác sử dụng, xin chọn tài khoản khác.",
      });
    }
  }
});

//xoa nhan vien
app.delete("/api/v1/nhan-vien/xoa-nhan-vien/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_nhanvien where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa tài khoản:" + err.message);
  }
});

//#endregion

//#region Xin Nghỉ
//danh sach dang cho xin nghỉ
app.get("/api/v1/xin-nghi/danh-sach-cho", async (req, res) => {
  try {
    const result = await db.query(
      "select * from v_xinnghi where trangthai = 0"
    );

    res.status(200).json({
      status: "ok",
      data: {
        xinnghi: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach xin nghi đang chờ: " + err.message);
  }
});

//danh sach dang cho xin nghỉ
app.get("/api/v1/xin-nghi/danh-sach-da-duyet", async (req, res) => {
  try {
    const result = await db.query(
      "select * from v_xinnghi where trangthai <> 0"
    );

    res.status(200).json({
      status: "ok",
      data: {
        xinnghi: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach xin nghi da duyet: " + err.message);
  }
});

// danh sach da duyet theo id
app.get("/api/v1/xin-nghi/danh-sach-da-duyet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_xinnghi where trangthai <> 0 and id=$1",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        xinnghi: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach xin nghi da duyet: " + err.message);
  }
});

// danh sach xin nghi full
app.get("/api/v1/xin-nghi/danh-sach-full/:nvid", async (req, res) => {
  try {
    const { nvid } = req.params;
    const result = await db.query(
      "select * from v_xinnghi where nhanvien_id=$1 order by id asc ",
      [nvid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        xinnghi: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach xin nghi full: " + err.message);
  }
});

// danh sach xin nghi full theo id
app.get("/api/v1/xin-nghi/danh-sach-full-theo-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_xinnghi where id = $1 order by id asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        xinnghi: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach xin nghi full theo id:" + err.message);
  }
});

//them don xin nghi
app.post("/api/v1/xin-nghi/them", async (req, res) => {
  try {
    const { khinao, baolau, lydo, nhanvien_id } = req.body;
    const result = await db.query(
      "insert into tbl_nhanvien_nghi (khinao, baolau,lydo,nhanvien_id) values($1,$2,$3,$4 ) returning *",
      [khinao, baolau, lydo, nhanvien_id]
    );

    res.status(201).json({
      status: "ok",
      data: {
        xinnghi: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them don xin nghi:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_nhanvien_ngaynghi"'
    ) {
      res.status(200).json({
        status: "Bạn tại ngày này đã xin nghỉ rồi",
      });
    }
  }
});

//sua don xin nghi
app.put("/api/v1/xin-nghi/sua", async (req, res) => {
  try {
    const { id, khinao, baolau, lydo } = req.body;

    const result = await db.query(
      "update tbl_nhanvien_nghi set khinao=$2, baolau=$3,lydo=$4 where id=$1",
      [id, khinao, baolau, lydo]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua don xin nghi: " + err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_nhanvien_ngaynghi"'
    ) {
      res.status(200).json({
        status: "Bạn tại ngày này đã xin nghỉ rồi",
      });
    }
  }
});

//xoa don xin nghi
app.delete("/api/v1/xin-nghi/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "delete from tbl_nhanvien_nghi where id = $1 and trangthai = 0 ",
      [id]
    );
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa đơn xin nghi:" + err.message);
  }
});

//xoa don da duyet
app.delete("/api/v1/xin-nghi/xoa-da-duyet/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "delete from tbl_nhanvien_nghi where id = $1 and trangthai <> 0 ",
      [id]
    );
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa đơn xin nghi da duyet:" + err.message);
  }
});

// chap nhan hoac tu choi don xin nghi
app.put("/api/v1/xin-nghi/ql-duyet", async (req, res) => {
  try {
    const { id, trangthai, nguoiduyet, ph_nguoiduyet } = req.body;

    const result = await db.query(
      "update tbl_nhanvien_nghi set trangthai=$2, nguoiduyet=$3,ph_nguoiduyet=$4, tgduyet=now()::timestamp where id=$1",
      [id, trangthai, nguoiduyet, ph_nguoiduyet]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Quan ly duyet don xin nghi: " + err.message);
  }
});

//#endregion

//#region Phong

//lay danh sach phong
app.get("/api/v1/phong/danh-sach-phong", async (req, res) => {
  try {
    const result = await db.query("select * from tbl_phong order by ten asc");

    res.status(200).json({
      status: "ok",
      data: {
        phong: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach phong: " + err.message);
  }
});
//lay danh sach phong san sang
app.get("/api/v1/phong/danh-sach-phong-ss/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from tbl_phong where ten <> $1 and trangthai = 0 order by ten asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        phong: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach phong ss: " + err.message);
  }
});

app.get("/api/v1/phong/loc-theo-trang-thai/:tt", async (req, res) => {
  try {
    const { tt } = req.params;
    const result = await db.query(
      "select * from tbl_phong where cast(trangthai as text) like $1 order by ten asc",
      [tt]
    );

    res.status(200).json({
      status: "ok",
      data: {
        phong: result.rows,
      },
    });
  } catch (err) {
    console.error("Loc phong theo tt: " + err.message);
  }
});

// lay 1 phong theo id
app.get("/api/v1/phong/danh-sach-phong/:ten", async (req, res) => {
  try {
    const { ten } = req.params;
    const result = await db.query("select * from tbl_phong where ten = $1", [
      ten,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        phong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 phong: " + err.message);
  }
});

//them phong
app.post("/api/v1/phong/them-phong", async (req, res) => {
  try {
    const {
      ten,
      trangthai,
      anh,
      tieude,
      mtngangon,
      mtchitiet,
      giaphongtheongay,
      giaphongtheogio,
      filename,
    } = req.body;
    const result = await db.query(
      "insert into tbl_phong (ten, trangthai,anh,tieude,mota_ngangon,mota_chitiet,giaphongtheongay,giaphongtheogio,filename) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
      [
        ten,
        trangthai,
        anh,
        tieude,
        mtngangon,
        mtchitiet,
        giaphongtheongay,
        giaphongtheogio,
        filename,
      ]
    );

    res.status(201).json({
      status: "ok",
      data: {
        phong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them phong:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "tbl_phong_pkey"'
    ) {
      res.status(201).json({
        status: "Tên phòng đã tồn tại, vui lòng đặt tên khác ",
      });
    }
  }
});

//sua phong
app.put("/api/v1/phong/sua-phong", async (req, res) => {
  try {
    const {
      ten,
      trangthai,
      anh,
      tieude,
      mtngangon,
      mtchitiet,
      giaphongtheongay,
      giaphongtheogio,
      filename,
    } = req.body;

    const result = await db.query(
      "update tbl_phong set trangthai=$2,anh=$3,filename=$4,tieude=$5,mota_ngangon=$6,mota_chitiet=$7,giaphongtheongay=$8,giaphongtheogio=$9 where ten=$1",
      [
        ten,
        trangthai,
        anh,
        filename,
        tieude,
        mtngangon,
        mtchitiet,
        giaphongtheongay,
        giaphongtheogio,
      ]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua phong: " + err.message);
  }
});

//xoa phong
app.delete("/api/v1/phong/xoa-phong/:ten", async (req, res) => {
  try {
    const { ten } = req.params;

    await db.query("delete from tbl_phong where ten = $1", [ten]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa phong:" + err.message);
  }
});

//upload
// app.post("/api/v1/phong/uploads", multipartMiddleware, (req, res) => {
//   console.log("Body: " + req.body);
//   console.log("File: " + req.files);
//   console.log("Upload: " + req.files.upload);
// });

//update trang thai phong
app.put("/api/v1/phong/update-tt", async (req, res) => {
  try {
    const { ten, trangthai } = req.body;

    const result = await db.query(
      "update tbl_phong set trangthai=$2 where ten=$1",
      [ten, trangthai]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua trang thai phong: " + err.message);
  }
});

//#endregion

//#region Dich vu
//lay danh sach dich vu
app.get("/api/v1/dich-vu/danh-sach-dich-vu", async (req, res) => {
  try {
    const result = await db.query("select * from tbl_dichvu order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        dichvu: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach dich vu: " + err.message);
  }
});

// lay 1 dich vu theo id
app.get("/api/v1/dich-vu/danh-sach-dich-vu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_dichvu where id = $1", [id]);

    res.status(200).json({
      status: "ok",
      data: {
        dichvu: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 dichvu: " + err.message);
  }
});

//them dich vu
app.post("/api/v1/dich-vu/them-dich-vu", async (req, res) => {
  try {
    const { ten, ghichu, giadv, trangthai, anh, filename, loaidv } = req.body;
    const result = await db.query(
      "insert into tbl_dichvu (ten,ghichu,giahientai,trangthai,anhminhhoa,filename,loaidichvu_id) values($1,$2,$3,$4,$5,$6,$7) returning *",
      [ten, ghichu, giadv, trangthai, anh, filename, loaidv]
    );

    res.status(201).json({
      status: "ok",
      data: {
        dichvu: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them dich vu:", err.message);
  }
});

//sua dich vu
app.put("/api/v1/dich-vu/sua-dich-vu", async (req, res) => {
  try {
    const { id, ten, ghichu, giadv, trangthai, anh, filename, loaidichvu_id } =
      req.body;

    const result = await db.query(
      "update tbl_dichvu set ten=$1,ghichu = $2,giahientai=$3,trangthai=$4,anhminhhoa=$5,filename=$6,loaidichvu_id=$8 where id=$7",
      [ten, ghichu, giadv, trangthai, anh, filename, id, loaidichvu_id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua dich vu: " + err.message);
  }
});

//xoa dich vu
app.delete("/api/v1/dich-vu/xoa-dich-vu/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_dichvu where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa dich vu:" + err.message);
  }
});

// danh sach loai dich vu
app.get("/api/v1/dich-vu/danh-sach-loai-dich-vu", async (req, res) => {
  try {
    const result = await db.query("select * from tbl_dichvu_loai");
    res.status(200).json({
      status: "ok",
      data: {
        loaidv: result.rows,
      },
    });
  } catch (err) {
    console.log("Danh sach loai dich vu: " + err.message);
  }
});

//them dich vu
app.post("/api/v1/dich-vu/them-loai-dich-vu", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      "insert into tbl_dichvu_loai (name) values($1) returning *",
      [name]
    );

    res.status(201).json({
      status: "ok",
      data: {
        loaidichvu: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them loai dich vu:", err.message);
  }
});

// lay 1 loai dich vu theo id
app.get("/api/v1/dich-vu/danh-sach-loai-dich-vu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from tbl_dichvu_loai where id = $1",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        loaidichvu: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 loai dichvu: " + err.message);
  }
});

// loc danh sach dich vu theo loai
app.get("/api/v1/dich-vu/loc-theo-loai/:loaidvid", async (req, res) => {
  try {
    const { loaidvid } = req.params;
    const result = await db.query(
      "select * from tbl_dichvu where loaidichvu_id = $1",
      [loaidvid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        loaidv: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay 1 loai dichvu: " + err.message);
  }
});

//#endregion

//#region TAi SAN

// danh sach tai san
app.get("/api/v1/tai-san/danh-sach-tai-san", async (req, res) => {
  try {
    const result = await db.query("select * from tbl_taisan order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        taisan: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach tài sản: " + err.message);
  }
});

// lay 1 tai san theo id (su dung view)
app.get("/api/v1/tai-san/danh-sach-tai-san/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_taisan where id = $1", [id]);

    res.status(200).json({
      status: "ok",
      data: {
        taisan: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 tai san theo id co view: " + err.message);
  }
});

//them tai san
app.post("/api/v1/tai-san/them-tai-san", async (req, res) => {
  try {
    const {
      ten,
      ghichu,
      giataisan,
      ngaymua,
      trangthai,
      vitri,
      bdlancuoi,
      dvt_id,
      nhacc_id,
      loaitaisan_id,
    } = req.body;
    const result = await db.query(
      "insert into tbl_taisan (ten,ghichu,giataisan,ngaymua,trangthai,vitri,bdlancuoi,dvt_id,nhacc_id,loaitaisan_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *",
      [
        ten,
        ghichu,
        giataisan,
        ngaymua,
        trangthai,
        vitri,
        bdlancuoi,
        dvt_id,
        nhacc_id,
        loaitaisan_id,
      ]
    );

    res.status(201).json({
      status: "ok",
      data: {
        taisan: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them tai san:", err.message);
  }
});

//sua tai san
app.put("/api/v1/tai-san/sua-tai-san", async (req, res) => {
  try {
    const {
      id,
      ten,
      ghichu,
      giataisan,
      ngaymua,
      trangthai,
      vitri,
      bdlancuoi,
      dvt_id,
      nhacc_id,
      loaitaisan_id,
    } = req.body;

    const result = await db.query(
      "update tbl_taisan set ten=$2,ghichu =$3,giataisan=$4,ngaymua=$5,trangthai=$6,vitri=$7,bdlancuoi=$8,dvt_id=$9,nhacc_id=$10,loaitaisan_id=$11 where id=$1",
      [
        id,
        ten,
        ghichu,
        giataisan,
        ngaymua,
        trangthai,
        vitri,
        bdlancuoi,
        dvt_id,
        nhacc_id,
        loaitaisan_id,
      ]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua tai san:  " + err.message);
  }
});

//xoa tai san
app.delete("/api/v1/tai-san/xoa-tai-san/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_taisan where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa tai san:" + err.message);
  }
});

// danh sach loai tai san
app.get("/api/v1/tai-san/danh-sach-loai-tai-san", async (req, res) => {
  try {
    const result = await db.query(
      "select * from tbl_taisan_loai order by id asc"
    );

    res.status(200).json({
      status: "ok",
      data: {
        loaitaisan: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach loai tài sản: " + err.message);
  }
});

//them loai tai san
app.post("/api/v1/tai-san/them-loai-tai-san", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      "insert into tbl_taisan_loai (name) values($1) returning *",
      [name]
    );

    res.status(201).json({
      status: "ok",
      data: {
        loaitaisan: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them loai tai san:", err.message);
  }
});

//#endregion

//#region Bao duong
// danh sach bao duong
app.get("/api/v1/bao-duong/danh-sach", async (req, res) => {
  try {
    const result = await db.query("select * from v_baoduong order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        baoduong: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach bao duong: " + err.message);
  }
});

// lay 1 bao duong theo id (su dung view)
app.get("/api/v1/bao-duong/danh-sach/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_baoduong where id = $1", [
      id,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        baoduong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 bao duong theo id co view: " + err.message);
  }
});

//them bao duong
app.post("/api/v1/bao-duong/them", async (req, res) => {
  try {
    const { nguoibd, sdt, ngaybd, ghichu, nvtiepnhan } = req.body;
    const result = await db.query(
      "insert into tbl_taisan_baoduong (nguoibd,sdt,ngaybd,ghichu,nvtiepnhan) values($1,$2,$3,$4,$5) returning *",
      [nguoibd, sdt, ngaybd, ghichu, nvtiepnhan]
    );

    res.status(201).json({
      status: "ok",
      data: {
        baoduong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them bao duong", err.message);
  }
});

//sua bao duong
app.put("/api/v1/bao-duong/sua", async (req, res) => {
  try {
    const { id, nguoibd, sdt, ngaybd, ghichu, nvtiepnhan } = req.body;

    const result = await db.query(
      "update tbl_taisan_baoduong set nguoibd=$2,sdt =$3,ngaybd=$4,ghichu=$5,nvtiepnhan=$6 where id=$1",
      [id, nguoibd, sdt, ngaybd, ghichu, nvtiepnhan]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua bao duong:  " + err.message);
  }
});

//xoa bao duong
app.delete("/api/v1/bao-duong/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_taisan_baoduong where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa bao duong:" + err.message);
  }
});

//lay danh sach bao duong chi tiet theo id bao duong
app.get(
  "/api/v1/bao-duong/danh-sach-chi-tiet/:baoduongid",
  async (req, res) => {
    try {
      const { baoduongid } = req.params;
      const result = await db.query(
        "select * from v_bdchitiet where baoduong_id=$1 order by id asc",
        [baoduongid]
      );

      res.status(200).json({
        status: "ok",
        data: {
          baoduong_chitiet: result.rows,
        },
      });
    } catch (err) {
      console.error("Lay danh sach bao duong chi tiet: " + err.message);
    }
  }
);

// lay 1 bao duong chi tiet theo id
app.get("/api/v1/bao-duong/chi-tiet-theo-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_bdchitiet where id=$1 order by id asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        baoduong_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach bao duong chi tiet theo id: " + err.message);
  }
});

//them bao duong chi tiet
app.post("/api/v1/bao-duong/them-chi-tiet", async (req, res) => {
  try {
    const { taisanbd, phibd, ghichu, baoduong_id } = req.body;
    const result = await db.query(
      "insert into tbl_taisan_baoduong_chitiet (taisanbd,phibd,ghichu,baoduong_id) values($1,$2,$3,$4) returning *",
      [taisanbd, phibd, ghichu, baoduong_id]
    );

    res.status(201).json({
      status: "ok",
      data: {
        baoduong_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them bao duong chi tiet: ", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_bdct_taisan"'
    ) {
      res.status(201).json({
        status: "Tài sản này đã có trong danh sách. Mời bạn chọn tài sản khác.",
      });
    }
  }
});

//sua bao duong chi tiet
app.put("/api/v1/bao-duong/sua-chi-tiet", async (req, res) => {
  try {
    const { id, phibd, ghichu } = req.body;

    const result = await db.query(
      "update tbl_taisan_baoduong_chitiet set phibd=$2,ghichu=$3 where id=$1",
      [id, phibd, ghichu]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua bao duong chi tiet:  " + err.message);
  }
});

//xoa bao duong chi tiet theo id
app.delete("/api/v1/bao-duong/xoa-chi-tiet/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_taisan_baoduong_chitiet where id = $1", [
      id,
    ]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa bao duong chi tiet theo id:" + err.message);
  }
});

//#endregion

//#region Nha cung Cap

// danh sách nha cung cap
app.get("/api/v1/nha-cung-cap/danh-sach-nha-cung-cap", async (req, res) => {
  try {
    const result = await db.query("select * from tbl_nhacc order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        nhacungcap: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach nha cung cap: " + err.message);
  }
});

// lay 1 nha cc
app.get("/api/v1/nha-cung-cap/danh-sach/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from tbl_nhacc  where id = $1 order by id asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        nhacungcap: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 nha cung cap theo id: " + err.message);
  }
});

//them nha cc
app.post("/api/v1/nha-cung-cap/them", async (req, res) => {
  try {
    const { ten, diachi, sdt } = req.body;
    const result = await db.query(
      "insert into tbl_nhacc (ten,diachi,sdt) values($1,$2,$3) returning *",
      [ten, diachi, sdt]
    );

    res.status(201).json({
      status: "ok",
      data: {
        nhacungcap: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them nha cc:", err.message);
  }
});

//sua nha cc
app.put("/api/v1/nha-cung-cap/sua", async (req, res) => {
  try {
    const { id, ten, diachi, sdt } = req.body;

    const result = await db.query(
      "update tbl_nhacc set ten=$2,diachi=$3,sdt=$4 where id=$1",
      [id, ten, diachi, sdt]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua nha cc:  " + err.message);
  }
});

//xoa nha cc
app.delete("/api/v1/nha-cung-cap/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_nhacc where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa nha cc:" + err.message);
  }
});
//#endregion

//#region Don Vi Tinh

// danh sach don vi tinh
app.get("/api/v1/don-vi-tinh/danh-sach-don-vi-tinh", async (req, res) => {
  try {
    const result = await db.query(
      "select * from tbl_donvitinh order by id asc"
    );

    res.status(200).json({
      status: "ok",
      data: {
        donvitinh: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach don vi tinh: " + err.message);
  }
});

//them dvt
app.post("/api/v1/don-vi-tinh/them-don-vi-tinh", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      "insert into tbl_donvitinh (name) values($1) returning *",
      [name]
    );

    res.status(201).json({
      status: "ok",
      data: {
        donvitinh: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them don vi tinh:", err.message);
  }
});
//#endregion

//#region Phieu mua

// danh sach phieu mua
app.get("/api/v1/phieu-mua/danh-sach", async (req, res) => {
  try {
    const result = await db.query("select * from v_phieumua order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        phieumua: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach phieu mua: " + err.message);
  }
});

// lay 1 phieu mua theo id (su dung view)
app.get("/api/v1/phieu-mua/danh-sach/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_phieumua where id = $1", [
      id,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        phieumua: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 phieu mua theo id co view: " + err.message);
  }
});

//them phieu mua
app.post("/api/v1/phieu-mua/them", async (req, res) => {
  try {
    const { ngaymua, ghichu, nvtiepnhan } = req.body;
    const result = await db.query(
      "insert into tbl_phieumua (ngaymua, ghichu, nvtiepnhan) values($1,$2,$3) returning *",
      [ngaymua, ghichu, nvtiepnhan]
    );

    res.status(201).json({
      status: "ok",
      data: {
        phieumua: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them ngay mua", err.message);
  }
});

//sua phieu mua
app.put("/api/v1/phieu-mua/sua", async (req, res) => {
  try {
    const { id, ngaymua, ghichu, nvtiepnhan } = req.body;

    const result = await db.query(
      "update tbl_phieumua set ngaymua=$2, ghichu=$3, nvtiepnhan=$4 where id=$1",
      [id, ngaymua, ghichu, nvtiepnhan]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua phieu mua:  " + err.message);
  }
});

//xoa phieu mua
app.delete("/api/v1/phieu-mua/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_phieumua where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa phieu mua:" + err.message);
  }
});

//lay danh sach phieu mua chi tiet theo id phieu mua
app.get(
  "/api/v1/phieu-mua/danh-sach-chi-tiet/:phieumuaid",
  async (req, res) => {
    try {
      const { phieumuaid } = req.params;
      const result = await db.query(
        "select * from v_pmchitiet where phieumua_id=$1 order by id asc",
        [phieumuaid]
      );

      res.status(200).json({
        status: "ok",
        data: {
          phieumua_chitiet: result.rows,
        },
      });
    } catch (err) {
      console.error("Lay danh sach phieu mua chi tiet: " + err.message);
    }
  }
);

// lay 1 phieu mua chi tiet theo id
app.get("/api/v1/phieu-mua/chi-tiet-theo-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_pmchitiet where id=$1 order by id asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        phieumua_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay danh sach phieu mua chi tiet theo id: " + err.message);
  }
});

//them phieu mua chi tiet
app.post("/api/v1/phieu-mua/them-chi-tiet", async (req, res) => {
  try {
    const {
      ten,
      dongia,
      soluong,
      thanhtien,
      ghichu,
      phieumua_id,
      donvitinh,
      loaihang_id,
      nhacc_id,
    } = req.body;
    const result = await db.query(
      "insert into tbl_phieumua_chitiet (ten,dongia,soluong,thanhtien,ghichu,phieumua_id,donvitinh,loaihang_id,nhacc_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
      [
        ten,
        dongia,
        soluong,
        thanhtien,
        ghichu,
        phieumua_id,
        donvitinh,
        loaihang_id,
        nhacc_id,
      ]
    );

    res.status(201).json({
      status: "ok",
      data: {
        phieumua_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them phieu mua chi tiet: ", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_pmid_tenhh"'
    ) {
      res.status(201).json({
        status: "Mặt hàng này đã có trong danh sách.",
      });
    }
  }
});

//sua phieu mua chi tiet
app.put("/api/v1/phieu-mua/sua-chi-tiet", async (req, res) => {
  try {
    const {
      id,
      ten,
      dongia,
      soluong,
      thanhtien,
      ghichu,
      donvitinh,
      loaihang_id,
      nhacc_id,
    } = req.body;

    const result = await db.query(
      "update tbl_phieumua_chitiet set ten=$2,dongia=$3,soluong=$4,thanhtien=$5,ghichu=$6,donvitinh=$7,loaihang_id=$8,nhacc_id=$9 where id=$1",
      [
        id,
        ten,
        dongia,
        soluong,
        thanhtien,
        ghichu,
        donvitinh,
        loaihang_id,
        nhacc_id,
      ]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua phieu mua chi tiet:  " + err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_pmid_tenhh"'
    ) {
      res.status(201).json({
        status: "Mặt hàng này đã có trong danh sách.",
      });
    }
  }
});

//xoa phieu mua chi tiet theo id
app.delete("/api/v1/phieu-mua/xoa-chi-tiet/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_phieumua_chitiet where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa phieu mua chi tiet theo id:" + err.message);
  }
});

// danh sach loai hang hoa
app.get("/api/v1/phieu-mua/danh-sach-loai-hang-hoa", async (req, res) => {
  try {
    const result = await db.query(
      "select * from tbl_phieumua_loaihang order by id asc"
    );

    res.status(200).json({
      status: "ok",
      data: {
        loaihh: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach loai hang hoa: " + err.message);
  }
});

//them loai hang hoa
app.post("/api/v1/phieu-mua/them-loai-hang-hoa", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      "insert into tbl_phieumua_loaihang (name) values($1) returning *",
      [name]
    );

    res.status(201).json({
      status: "ok",
      data: {
        loaihh: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them loai hanghoa:", err.message);
  }
});

//#endregion

//#region Khach hang
//them khach hang
app.post("/api/v1/khach-hang/them", async (req, res) => {
  try {
    const {
      ten,
      cmnd,
      gioitinh,
      ngaysinh,
      diachi,
      sdt,
      kieukhachhang_id,
      account,
    } = req.body;
    const result = await db.query(
      "insert into tbl_khachhang (ten,cmnd,gioitinh,ngaysinh,diachi,sdt, kieukhachhang_id,account) values($1,$2,$3,$4,$5,$6,$7,$8) returning *",
      [ten, cmnd, gioitinh, ngaysinh, diachi, sdt, kieukhachhang_id, account]
    );

    res.status(201).json({
      status: "ok",
      data: {
        khachhang: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them khach hang:", err.message);
  }
});
//danh sach kh
app.get("/api/v1/khach-hang/danh-sach", async (req, res) => {
  try {
    const result = await db.query("select * from v_khachhang order by id asc");

    res.status(200).json({
      status: "ok",
      data: {
        khachhang: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach : " + err.message);
  }
});

//lay 1 kh
app.get("/api/v1/khach-hang/danh-sach/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_khachhang where id = $1", [
      id,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        khachhang: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 khach hàng: " + err.message);
  }
});

//sua kh
app.put("/api/v1/khach-hang/sua", async (req, res) => {
  try {
    const { id, ten, cmnd, gioitinh, ngaysinh, diachi, sdt, kieukhachhang_id } =
      req.body;

    const result = await db.query(
      "update tbl_khachhang set ten=$2,cmnd=$3,gioitinh=$4,ngaysinh=$5,diachi=$6,sdt=$7,kieukhachhang_id=$8 where id=$1",
      [id, ten, cmnd, gioitinh, ngaysinh, diachi, sdt, kieukhachhang_id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua khach hang:  " + err.message);
  }
});

//sua kh khi check in
app.put("/api/v1/khach-hang/sua-checkin", async (req, res) => {
  try {
    const { id, ten, cmnd, sdt } = req.body;

    const result = await db.query(
      "update tbl_khachhang set ten=$2,cmnd=$3,sdt=$4 where id=$1",
      [id, ten, cmnd, sdt]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua khach hang khi checkins:  " + err.message);
  }
});

//kiem tra khach hàng có trong hoa don khong
app.get("/api/v1/khach-hang/trong-hoa-don/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select count(*) from v_hoadon where kh_id=$1",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        khachhang: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Kiem tra kh trong hoa don: " + err.message);
  }
});

//kiem tra khach hàng có trong datphong
app.get("/api/v1/khach-hang/trong-dat-phong/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select count(*) from v_datphong where kh_id=$1",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        khachhang: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Kiem tra kh trong datphong: " + err.message);
  }
});

//danh sách kieu kh
app.get("/api/v1/khach-hang/danh-sach-kieu", async (req, res) => {
  try {
    const result = await db.query(
      "select * from tbl_khachhang_kieu order by id asc"
    );

    res.status(200).json({
      status: "ok",
      data: {
        kieukh: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach kieu khach hang: " + err.message);
  }
});

//them kieu kh
app.post("/api/v1/khach-hang/them-kieu", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      "insert into tbl_khachhang_kieu (name) values($1) returning *",
      [name]
    );

    res.status(201).json({
      status: "ok",
      data: {
        kieukh: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them kieu khach hang:", err.message);
  }
});

//xoa khach hang
app.delete("/api/v1/khach-hang/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("delete from tbl_khachhang where id = $1", [id]);
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xóa kh:" + err.message);
  }
});

//#endregion

//#region Dat phong

// danh sach dat phong
app.get("/api/v1/dat-phong/danh-sach-full", async (req, res) => {
  try {
    const result = await db.query("select * from v_datphong order by id desc ");

    res.status(200).json({
      status: "ok",
      data: {
        datphong: result.rows,
      },
    });
  } catch (err) {
    console.error("danh sach dat phong full: " + err.message);
  }
});

// danh sach full theo id
app.get("/api/v1/dat-phong/danh-sach-full/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_datphong where id=$1", [id]);

    res.status(200).json({
      status: "ok",
      data: {
        datphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("danh sach full theo id: " + err.message);
  }
});

//danh sach dat phong theo khach hang
app.get("/api/v1/dat-phong/danh-sach-theo-kh/:khid", async (req, res) => {
  try {
    const { khid } = req.params;
    const result = await db.query(
      "select * from v_datphong where trangthai = 1 and kh_id = $1",
      [khid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        datphong: result.rows,
      },
    });
  } catch (err) {
    console.error("danh sach dat phong theo kh: " + err.message);
  }
});

// them dat phong
app.post("/api/v1/dat-phong/them", async (req, res) => {
  try {
    const {
      khachhang_id,
      hinhthucdp,
      checkin,
      checkout,
      phong_id,
      kieuthue,
      giathue,
      sotgthue,
      nv,
      tongtien,
      trangthai,
      tiencoc,
    } = req.body;
    const result = await db.query(
      "insert into tbl_datphong (khachhang_id,hinhthucdp,  checkin, checkout, phong_id, kieuthue,giathue, sotgthue, nv,tongtien,trangthai,tiencoc) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
      [
        khachhang_id,
        hinhthucdp,
        checkin,
        checkout,
        phong_id,
        kieuthue,
        giathue,
        sotgthue,
        nv,
        tongtien,
        trangthai,
        tiencoc,
      ]
    );

    res.status(201).json({
      status: "ok",
      data: {
        datphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them dat phong:", err.message);
  }
});

//danh sach dat phong theo phong
app.get("/api/v1/dat-phong/danh-sach/:phongid", async (req, res) => {
  try {
    const { phongid } = req.params;
    const result = await db.query(
      "select * from v_datphong where phong_id = $1 and trangthai = 1",
      [phongid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        datphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 phong: " + err.message);
  }
});

// check in
app.put("/api/v1/dat-phong/check-in", async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      "update tbl_datphong set kh_checkin = current_timestamp where id=$1",
      [id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Check In:  " + err.message);
  }
});

// check out
app.put("/api/v1/dat-phong/check-out", async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      "update tbl_datphong set kh_checkout = current_timestamp where id=$1",
      [id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Check Out:  " + err.message);
  }
});

//them chi tiet
app.post("/api/v1/dat-phong/them-chi-tiet", async (req, res) => {
  try {
    const { datphong_id, dichvu_id, gia, soluong, thanhtien } = req.body;
    const result = await db.query(
      "insert into tbl_datphong_sddichvu (datphong_id,dichvu_id,gia,soluong,thanhtien) values($1,$2,$3,$4,$5) returning *",
      [datphong_id, dichvu_id, gia, soluong, thanhtien]
    );

    res.status(201).json({
      status: "ok",
      data: {
        datphong_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them dat phong chi tiet:", err.message);
    if (
      err.message ===
      'duplicate key value violates unique constraint "u_dichvu"'
    ) {
      res.status(201).json({
        status:
          "Dịch vụ đã được sử dụng, do đó sẽ tự động tăng số lượng dịch vụ này lên.",
      });
    }
  }
});

//danh sach dich vu dat phong su dung
app.get("/api/v1/dat-phong/danh-sach-dich-vu/:dpid", async (req, res) => {
  try {
    const { dpid } = req.params;
    const result = await db.query(
      "select * from v_dpchitiet where datphong_id = $1 order by id asc",
      [dpid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        datphong_chitiet: result.rows,
      },
    });
  } catch (err) {
    console.error("Lay danh sach dich vu theo datphong id: " + err.message);
  }
});

//lay 1 dp chitiet
app.get("/api/v1/dat-phong/danh-sach-dich-vu-theo-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_dpchitiet where id = $1", [
      id,
    ]);

    res.status(200).json({
      status: "ok",
      data: {
        datphong_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Lay 1 dpchitet: " + err.message);
  }
});

//kiem tra dich vu da dduoc su dung chua
app.get("/api/v1/dat-phong/kiem-tra-dv/:dvid/:dpid", async (req, res) => {
  try {
    const { dvid, dpid } = req.params;
    const result = await db.query(
      "select * from tbl_datphong_sddichvu where datphong_id = $1 and dichvu_id = $2",
      [dpid, dvid]
    );

    res.status(200).json({
      status: "ok",
      data: {
        datphong_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("kiem tra dich vu da su dung chua: " + err.message);
  }
});

// Cap nhat so luong ++
app.put("/api/v1/dat-phong/tang-so-luong", async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      "update tbl_datphong_sddichvu set soluong=soluong+1 where id=$1",
      [id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("tăng so luong:  " + err.message);
  }
});

// Cap nhat so luong --
app.put("/api/v1/dat-phong/giam-so-luong", async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      "update tbl_datphong_sddichvu set soluong=soluong-1 where id=$1",
      [id]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("tăng so luong:  " + err.message);
  }
});

//update  tt
app.put("/api/v1/dat-phong/update-tt", async (req, res) => {
  try {
    const { id, trangthai } = req.body;

    const result = await db.query(
      "update tbl_datphong set trangthai=$2 where id=$1",
      [id, trangthai]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua trang thai dat phong: " + err.message);
  }
});

// xoa dat phong chi tiet
app.delete("/api/v1/dat-phong/xoa-chi-tiet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "delete from tbl_datphong_sddichvu where id = $1",
      [id]
    );
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xoa chi tiet dat phong: " + err.message);
  }
});

// xoa dat phong bi huy
app.delete("/api/v1/dat-phong/xoa-phieu-thue-bi-huy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "delete from tbl_datphong where id = $1 and trangthai =2",
      [id]
    );
    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Xoa  dat phong bi huy: " + err.message);
  }
});

//#endregion

//#region Hoa don
// danh sach hoa don
app.get("/api/v1/hoa-don/danh-sach", async (req, res) => {
  try {
    const result = await db.query("select * from v_hoadon order by id desc");

    res.status(200).json({
      status: "ok",
      data: {
        hoadon: result.rows,
      },
    });
  } catch (err) {
    console.error("danh sach hoa don: " + err.message);
  }
});

// danh sach hoa don theo id
app.get("/api/v1/hoa-don/danh-sach/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("select * from v_hoadon where id = $1", [id]);

    res.status(200).json({
      status: "ok",
      data: {
        hoadon: result.rows[0],
      },
    });
  } catch (err) {
    console.error("danh sach hoa don theo id: " + err.message);
  }
});

// them hoa don
app.post("/api/v1/hoa-don/them", async (req, res) => {
  try {
    const { nv, khachhang_id, hinhthuctt, vat } = req.body;
    const result = await db.query(
      "insert into tbl_hoadon (nv,khachhang_id,hinhthuctt,vat) values($1,$2,$3,$4) returning *",
      [nv, khachhang_id, hinhthuctt, vat]
    );

    res.status(201).json({
      status: "ok",
      data: {
        hoadon: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Themhoa don:", err.message);
  }
});

// sua hoa don
app.put("/api/v1/hoa-don/sua", async (req, res) => {
  try {
    const { id, nv, hinhthuctt, vat } = req.body;
    const result = await db.query(
      "update tbl_hoadon set nv=$2,hinhthuctt=$3,vat=$4 where id=$1",
      [id, nv, hinhthuctt, vat]
    );

    res.status(201).json({
      status: "ok",
    });
  } catch (err) {
    console.error("Sua hoa don:", err.message);
  }
});

// xoa hoa don
app.delete("/api/v1/hoa-don/xoa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "delete from tbl_hoadon where id = $1",

      [id]
    );

    res.status(204).json({
      status: "ok",
    });
  } catch (err) {
    console.error("Xoa hoa don:", err.message);
  }
});

// lay hoa don chi tiet theo hoa don id
app.get("/api/v1/hoa-don/danh-sach-theo-hoa-don/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_hoadonct where hoadon_id = $1 order by phong asc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        hoadon_chitiet: result.rows,
      },
    });
  } catch (err) {
    console.error(
      "danh sach hoa don chi tiet theo  hoa don id: " + err.message
    );
  }
});

//update  tt
app.put("/api/v1/hoa-don/update-tt", async (req, res) => {
  try {
    const { id, trangthai } = req.body;

    const result = await db.query(
      "update tbl_hoadon set trangthai=$2 where id=$1",
      [id, trangthai]
    );
    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.log("Sua trang thai hoa don: " + err.message);
  }
});

//them hoa don chi tiet
app.post("/api/v1/hoa-don/them-chi-tiet", async (req, res) => {
  try {
    const { hoadon_id, datphong_id, tienphat, tongtien, tiencoc } = req.body;
    const result = await db.query(
      "insert into tbl_hoadon_chitiet (hoadon_id,datphong_id,tienphat,tongtien,tiencoc) values($1,$2,$3,$4,$5) returning *",
      [hoadon_id, datphong_id, tienphat, tongtien, tiencoc]
    );

    res.status(201).json({
      status: "ok",
      data: {
        hoadon_chitiet: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Themhoa don chi tiet:", err.message);
  }
});
//#endregion

//#region Doi huy
// them doi phong
app.post("/api/v1/doi-huy/them-doi-phong", async (req, res) => {
  try {
    const { tuphong, denphong, lydodoi, nguoidoi, datphong_id, giathue } =
      req.body;
    const result = await db.query(
      "insert into tbl_doiphong (tuphong,denphong,lydodoi,nguoidoi,datphong_id,giathue) values($1,$2,$3,$4,$5,$6) returning *",
      [tuphong, denphong, lydodoi, nguoidoi, datphong_id, giathue]
    );

    res.status(201).json({
      status: "ok",
      data: {
        doiphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them doi phong:", err.message);
  }
});

// them huy phong
app.post("/api/v1/doi-huy/them-huy-phong", async (req, res) => {
  try {
    const { phonghuy, lydohuy, nguoihuy, datphong_id, tiencoc } = req.body;
    const result = await db.query(
      "insert into tbl_huyphong ( phonghuy,lydohuy,nguoihuy,datphong_id,tiencoc) values($1,$2,$3,$4,$5) returning *",
      [phonghuy, lydohuy, nguoihuy, datphong_id, tiencoc]
    );

    res.status(201).json({
      status: "ok",
      data: {
        huyphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("Them doi phong:", err.message);
  }
});

// danh sach doi phong
app.get("/api/v1/doi-huy/danh-sach-doi", async (req, res) => {
  try {
    const result = await db.query("select * from v_doiphong order by id desc");

    res.status(200).json({
      status: "ok",
      data: {
        doiphong: result.rows,
      },
    });
  } catch (err) {
    console.error("danh sach doiphong: " + err.message);
  }
});

// danh sach doi phong theo id
app.get("/api/v1/doi-huy/danh-sach-doi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_doiphong where id=$1 order by id desc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        doiphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("danh sach doiphong theo id: " + err.message);
  }
});

// danh sach huy phong
app.get("/api/v1/doi-huy/danh-sach-huy", async (req, res) => {
  try {
    const result = await db.query("select * from v_huyphong order by id desc");

    res.status(200).json({
      status: "ok",
      data: {
        huyphong: result.rows,
      },
    });
  } catch (err) {
    console.error("danh sach huy phong: " + err.message);
  }
});

// danh sach huy phong theo id
app.get("/api/v1/doi-huy/danh-sach-huy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "select * from v_huyphong where id=$1 order by id desc",
      [id]
    );

    res.status(200).json({
      status: "ok",
      data: {
        huyphong: result.rows[0],
      },
    });
  } catch (err) {
    console.error("danh sach huy phong theo id: " + err.message);
  }
});
//sua ly do doi phong
app.put("/api/v1/doi-huy/sua-ly-do-doi", async (req, res) => {
  const { id, lydodoi } = req.body;
  try {
    const result = await db.query(
      "update tbl_doiphong set lydodoi = $1 where id=$2",
      [lydodoi, id]
    );

    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error("sua ly do doi phong: " + err.message);
  }
});

//sua ly do huy phong
app.put("/api/v1/doi-huy/sua-ly-do-huy", async (req, res) => {
  const { id, lydohuy } = req.body;
  try {
    const result = await db.query(
      "update tbl_huyphong set lydohuy = $1 where id=$2",
      [lydohuy, id]
    );

    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error("sua ly do huy phong: " + err.message);
  }
});

//xoa doi phong
app.delete("/api/v1/doi-huy/xoa-doi-phong/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("delete from tbl_doiphong where id=$1", [id]);

    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error("xoa doi phong: " + err.message);
  }
});

//xoa huy phong
app.delete("/api/v1/doi-huy/xoa-huy-phong/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("delete from tbl_huyphong where id=$1", [id]);

    res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error("xoa huy phong: " + err.message);
  }
});
//#endregion
