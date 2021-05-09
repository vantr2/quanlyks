import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import TaiKhoanPage from "./admin/TaiKhoanPage";
import DoiMatKhauPage from "./admin/DoiMatKhauPage";

import NhaCungCapPage from "./danhmuc/NhaCungCapPage";
import NhanVienPage from "./danhmuc/NhanVienPage";
import DetailPageNhanVien from "./danhmuc/nhanvien/DetailPageNhanVien";
import SuaPageNhanVien from "./danhmuc/nhanvien/SuaPageNhanVien";
import DichVuPage from "./danhmuc/DichVuPage";
import PhongPage from "./danhmuc/PhongPage";

import TinhTrangPhongPage from "./phong/TinhTrangPhongPage";
import DoiPhongPage from "./phong/DoiPhongPage";
import HuyPhongPage from "./phong/HuyPhongPage";
import DatPhongOnlinePage from "./phong/DatPhongOnlinePage";
import HoaDonPage from "./phong/HoaDonPage";

import KieuKhachHangPage from "./qlkhachhang/KieuKhachHangPage";
import ThongTinKHPage from "./qlkhachhang/ThongTinKHPage";

import TaiSanPage from "./qltaisan/TaiSanPage";
import BaoDuongPage from "./qltaisan/BaoDuongPage";
import ChiTietBaoDuongPage from "./qltaisan/baoduong/ChiTietBaoDuongPage";
import SuaBaoDuongPage from "./qltaisan/baoduong/SuaBaoDuongPage";

import LoaiHangHoaPage from "./qlhanghoa/LoaiHangHoaPage";
import PhieuMuaPage from "./qlhanghoa/PhieuMuaPage";

import XinNghiPage from "./qlnhanvien/XinNghiPage";
import BangLuongPage from "./qlnhanvien/BangLuongPage";
import ProfileNhanVienPage from "./qlnhanvien/ProfileNhanVienPage";

import ChamCongPage from "./nvquanly/ChamCongPage";
import DuyetDonPage from "./nvquanly/DonXinNghiPage";
import ChiTietPhongPage from "./danhmuc/phong/ChiTietPhongPage";
import SuaPhongPage from "./danhmuc/phong/SuaPhongPage";
import ChiTietDichVuPage from "./danhmuc/dichvu/ChiTietDichVuPage";
import SuaDichVuPage from "./danhmuc/dichvu/SuaDichVuPage";
import ChiTietTaiSanPage from "./qltaisan/thongtintaisan/ChiTietTaiSanPage";
import SuaTaiSanPage from "./qltaisan/thongtintaisan/SuaTaiSanPage";
import LichSuHoatDongPage from "./LichSuHoatDongPage";

const MenuQuanLy = () => {
  return (
    <Router>
      <Sidebar />
      <div className="container pt-5">
        <Switch>
          {/* lich su hoat dong */}
          <Route path="/quan-ly/" exact component={LichSuHoatDongPage} />

          {/* Admin */}
          <Route
            path="/quan-ly/admin/tai-khoan"
            exact
            component={TaiKhoanPage}
          />
          <Route
            path="/quan-ly/admin/doi-mat-khau"
            exact
            component={DoiMatKhauPage}
          />

          {/* Phong */}
          <Route
            path="/quan-ly/phong/tinh-trang"
            exact
            component={TinhTrangPhongPage}
          />
          <Route
            path="/quan-ly/phong/doi-phong"
            exact
            component={DoiPhongPage}
          />
          <Route
            path="/quan-ly/phong/huy-phong"
            exact
            component={HuyPhongPage}
          />
          <Route
            path="/quan-ly/phong/dat-phong-online"
            exact
            component={DatPhongOnlinePage}
          />
          <Route path="/quan-ly/phong/hoa-don" exact component={HoaDonPage} />

          {/* Danh muc */}
          <Route
            path="/quan-ly/danh-muc/nha-cung-cap"
            exact
            component={NhaCungCapPage}
          />
          <Route
            path="/quan-ly/danh-muc/nhan-vien"
            exact
            component={NhanVienPage}
          />
          <Route
            exact
            path="/quan-ly/danh-muc/nhan-vien/:id"
            component={DetailPageNhanVien}
          ></Route>

          <Route
            exact
            path="/quan-ly/danh-muc/nhan-vien/:id/sua"
            component={SuaPageNhanVien}
          ></Route>

          <Route
            path="/quan-ly/danh-muc/dich-vu"
            exact
            component={DichVuPage}
          />
          <Route
            path="/quan-ly/danh-muc/dich-vu/:id"
            exact
            component={ChiTietDichVuPage}
          />
          <Route
            path="/quan-ly/danh-muc/dich-vu/:id/sua"
            exact
            component={SuaDichVuPage}
          />

          <Route path="/quan-ly/danh-muc/phong" exact component={PhongPage} />
          <Route
            path="/quan-ly/danh-muc/phong/:ten"
            exact
            component={ChiTietPhongPage}
          />
          <Route
            path="/quan-ly/danh-muc/phong/:ten/sua"
            exact
            component={SuaPhongPage}
          />

          {/* Ql khach hang */}
          <Route
            path="/quan-ly/ql-khach-hang/kieu"
            exact
            component={KieuKhachHangPage}
          />
          <Route
            path="/quan-ly/ql-khach-hang/thong-tin"
            exact
            component={ThongTinKHPage}
          />

          {/* Ql tai san */}
          <Route
            path="/quan-ly/ql-tai-san/thong-tin"
            exact
            component={TaiSanPage}
          />

          <Route
            path="/quan-ly/ql-tai-san/thong-tin/:id"
            exact
            component={ChiTietTaiSanPage}
          />
          <Route
            path="/quan-ly/ql-tai-san/thong-tin/:id/sua"
            exact
            component={SuaTaiSanPage}
          />

          <Route
            path="/quan-ly/ql-tai-san/bao-duong"
            exact
            component={BaoDuongPage}
          />
          <Route
            path="/quan-ly/ql-tai-san/bao-duong/:id"
            exact
            component={ChiTietBaoDuongPage}
          />
          <Route
            path="/quan-ly/ql-tai-san/bao-duong/:id/sua"
            exact
            component={SuaBaoDuongPage}
          />

          {/* ql Hanghoa */}
          <Route
            path="/quan-ly/ql-hang-hoa/loai"
            exact
            component={LoaiHangHoaPage}
          />
          <Route
            path="/quan-ly/ql-hang-hoa/phieu-mua"
            exact
            component={PhieuMuaPage}
          />

          {/* Ql nhan vien */}
          <Route
            path="/quan-ly/nhan-vien/thong-tin"
            exact
            component={ProfileNhanVienPage}
          />
          <Route
            path="/quan-ly/nhan-vien/xin-nghi"
            exact
            component={XinNghiPage}
          />
          <Route
            path="/quan-ly/nhan-vien/bang-luong"
            exact
            component={BangLuongPage}
          />

          {/* Nv Quan ly */}
          <Route
            path="/quan-ly/nv-quan-ly/duyet-don"
            exact
            component={DuyetDonPage}
          />
          <Route
            path="/quan-ly/nv-quan-ly/cham-cong-nv"
            exact
            component={ChamCongPage}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default MenuQuanLy;
