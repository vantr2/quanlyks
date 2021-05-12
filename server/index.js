require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart({ uploadDir: "./images" });

const { encrypt, decrypt } = require("./EncrytionHandle");

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is starting by port ${port}`);
});

// middle ware
app.use(express.json());
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

// Lay danh sach nguoi dung
app.get("/api/v1/tai-khoan/danh-sach-nguoi-dung", async (req, res) => {
  try {
    const result = await db.query(
      "select ten,mk,ten_hienthi,trangthai,vaitro from tbl_nguoidung where ten <> $1",
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
      "select ten from tbl_nguoidung where ten <> $1 and trangthai = $2 and vaitro <> $3",
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
app.post("/api/v1/phong/uploads", multipartMiddleware, (req, res) => {
  console.log("Body: " + req.body);
  console.log("File: " + req.files);
  console.log("Upload: " + req.files.upload);
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

//them tai san
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
