import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { BrowserRouter as Switch, Route } from "react-router-dom";

import TaiKhoanPage from "./admin/TaiKhoanPage";

import NhaCungCapPage from "./danhmuc/NhaCungCapPage";
import NhanVienPage from "./danhmuc/NhanVienPage";
import DetailPageNhanVien from "./danhmuc/nhanvien/DetailPageNhanVien";
import SuaPageNhanVien from "./danhmuc/nhanvien/SuaPageNhanVien";
import DichVuPage from "./danhmuc/DichVuPage";
import PhongPage from "./danhmuc/PhongPage";
import LoaiPage from "./danhmuc/LoaiPage";

import TinhTrangPhongPage from "./phong/TinhTrangPhongPage";
import DanhSachDatPhongPage from "./phong/datphong/DanhSachDatPhongPage";
import ChiTietDatPhongPage from "./phong/datphong/ChiTietDatPhongPage";

import DatPhongOnlinePage from "./phong/DatPhongOnlinePage";
import HoaDonPage from "./phong/HoaDonPage";
import ChiTietHoaDonPage from "./phong/hoadon/ChiTietHoaDonPage";

import ThongTinKHPage from "./qlkhachhang/ThongTinKHPage";

import TaiSanPage from "./qltaisan/TaiSanPage";
import BaoDuongPage from "./qltaisan/BaoDuongPage";
import ChiTietBaoDuongPage from "./qltaisan/baoduong/ChiTietBaoDuongPage";
import SuaBaoDuongPage from "./qltaisan/baoduong/SuaBaoDuongPage";

import PhieuMuaPage from "./qlhanghoa/PhieuMuaPage";

import XinNghiPage from "./qlnhanvien/XinNghiPage";
import ChiTietDonXinNghiPage from "./qlnhanvien/xinnghi/ChiTietDonXinNghiPage";
import SuaDonXinNghiPage from "./qlnhanvien/xinnghi/SuaDonXinNghiPage";
import BangLuongPage from "./qlnhanvien/BangLuongPage";
import ProfileNhanVienPage from "./qlnhanvien/ProfileNhanVienPage";

import ChamCongPage from "./nvquanly/ChamCongPage";
import DuyetDonPage from "./nvquanly/DonXinNghiPage";
import DuyetDonChiTietPage from "./nvquanly/duyetdon/DuyetDonChiTietPage";
import ChiTietPhongPage from "./danhmuc/phong/ChiTietPhongPage";
import SuaPhongPage from "./danhmuc/phong/SuaPhongPage";
import ChiTietDichVuPage from "./danhmuc/dichvu/ChiTietDichVuPage";
import SuaDichVuPage from "./danhmuc/dichvu/SuaDichVuPage";
import ChiTietTaiSanPage from "./qltaisan/thongtintaisan/ChiTietTaiSanPage";
import SuaTaiSanPage from "./qltaisan/thongtintaisan/SuaTaiSanPage";
import LichSuHoatDongPage from "./LichSuHoatDongPage";
import SuaPhieuMuaPage from "./qlhanghoa/phieumua/SuaPhieuMuaPage";
import ChiTietPhieuMuaPage from "./qlhanghoa/phieumua/ChiTietPhieuMuaPage";
import CheckInPage from "./phong/datphong/CheckInPage";
import DatPhongPage from "./phong/datphong/DatPhongPage";
import SuDungDichVuPage from "./phong/datphong/SuDungDichVuPage";
import PhieuXacNhanPage from "./phong/PhieuXacNhanPage";
import ChiTietKhachHangPage from "./qlkhachhang/ChiTietKhachHangPage";
import ChiTietLichSuPage from "./lshoatdong/ChiTietLichSuPage";
import PhieuThuPage from "./thuchi/PhieuThuPage";
import PhieuChiPage from "./thuchi/PhieuChiPage";
import PhieuThuChiTietPage from "./thuchi/PhieuThuChiTietPage";
import InHoaDonPage from "./phong/hoadon/InHoaDonPage";

const MenuQuanLy = () => {
  return (
    <div>
      <Switch>
        <Sidebar />
        <div className="container pt-5">
          {/* <Route path="/quan-ly/*" component={LichSuHoatDongPage} /> */}
          {/* lich su hoat dong */}
          <Route path="/" exact component={LichSuHoatDongPage} />
          <Route
            path="/quan-ly/lich-su-hoat-dong/:id"
            exact
            component={ChiTietLichSuPage}
          />
          {/* Admin */}
          <Route
            path="/quan-ly/admin/tai-khoan"
            exact
            component={TaiKhoanPage}
          />
          {/* Phong */}
          <Route
            path="/quan-ly/phong/tinh-trang"
            exact
            component={TinhTrangPhongPage}
          />
          <Route
            path="/quan-ly/phong/dat-phong"
            exact
            component={DanhSachDatPhongPage}
          />
          <Route
            path="/quan-ly/phong/dat-phong/:id"
            exact
            component={ChiTietDatPhongPage}
          />
          <Route
            path="/quan-ly/phong/tinh-trang/:phongid/mophong"
            exact
            component={DatPhongPage}
          />
          <Route
            path="/quan-ly/phong/tinh-trang/:phongid/checkin"
            exact
            component={CheckInPage}
          />
          <Route
            path="/quan-ly/phong/tinh-trang/:phongid/su-dung-dich-vu"
            exact
            component={SuDungDichVuPage}
          />
          <Route
            path="/quan-ly/phong/phieu-xac-nhan"
            exact
            component={PhieuXacNhanPage}
          />
          <Route
            path="/quan-ly/phong/dat-phong-online"
            exact
            component={DatPhongOnlinePage}
          />
          <Route path="/quan-ly/phong/hoa-don" exact component={HoaDonPage} />
          <Route
            path="/quan-ly/phong/hoa-don/:id"
            exact
            component={ChiTietHoaDonPage}
          />
          <Route
            path="/quan-ly/phong/hoa-don/:id/in"
            exact
            component={InHoaDonPage}
          />
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
          <Route path="/quan-ly/danh-muc/loai" exact component={LoaiPage} />
          {/* Ql khach hang */}
          <Route path="/quan-ly/khach-hang" exact component={ThongTinKHPage} />
          <Route
            path="/quan-ly/khach-hang/:id"
            exact
            component={ChiTietKhachHangPage}
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
            path="/quan-ly/ql-hang-hoa/phieu-mua"
            exact
            component={PhieuMuaPage}
          />
          <Route
            path="/quan-ly/ql-hang-hoa/phieu-mua/:id"
            exact
            component={ChiTietPhieuMuaPage}
          />
          <Route
            path="/quan-ly/ql-hang-hoa/phieu-mua/:id/sua"
            exact
            component={SuaPhieuMuaPage}
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
            path="/quan-ly/nhan-vien/xin-nghi/:id"
            exact
            component={ChiTietDonXinNghiPage}
          />
          <Route
            path="/quan-ly/nhan-vien/xin-nghi/:id/sua"
            exact
            component={SuaDonXinNghiPage}
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
            path="/quan-ly/nv-quan-ly/duyet-don/:id"
            exact
            component={DuyetDonChiTietPage}
          />
          <Route
            path="/quan-ly/nv-quan-ly/cham-cong-nv"
            exact
            component={ChamCongPage}
          />{" "}
          {/* Thu chi */}
          <Route
            path="/quan-ly/thu-chi/phieu-thu"
            exact
            component={PhieuThuPage}
          />
          <Route
            path="/quan-ly/thu-chi/phieu-thu/:id"
            exact
            component={PhieuThuChiTietPage}
          />
          <Route
            path="/quan-ly/thu-chi/phieu-chi"
            exact
            component={PhieuChiPage}
          />
        </div>
      </Switch>
    </div>
  );
};

export default MenuQuanLy;
