import React from "react";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";
import * as DiIcons from "react-icons/di";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi";
import * as TiIcons from "react-icons/ti";
import * as ImIcons from "react-icons/im";
import * as MdIcons from "react-icons/md";
export const SidebarData = [
  //lich su hoat dong
  {
    title: "Lịch sử hoạt động",
    icon: <FaIcons.FaHistory />,
    role: ["Admin", "NVLT", "NVK", "QL", "NVDP"],
    path: "/quan-ly/",
  },
  // Admin
  {
    title: "Admin",
    icon: <RiIcons.RiAdminLine />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    role: ["Admin"],
    subNav: [
      {
        title: "Tài khoản",
        path: "/quan-ly/admin/tai-khoan",
        icon: <RiIcons.RiAccountPinCircleLine />,
      },
    ],
  },

  // Phòng
  {
    title: "Phòng",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    role: ["Admin", "NVLT", "QL"],
    subNav: [
      {
        title: "Tình trạng phòng",
        path: "/quan-ly/phong/tinh-trang",
        icon: <FaIcons.FaList />,
        cName: "sub-nav",
      },
      {
        title: "Đổi phòng",
        path: "/quan-ly/phong/doi-phong",
        icon: <ImIcons.ImLoop />,
        cName: "sub-nav",
      },
      {
        title: "Hủy phòng",
        path: "/quan-ly/phong/huy-phong",
        icon: <TiIcons.TiCancel />,
        cName: "sub-nav",
      },
      {
        title: "Đặt phòng online",
        path: "/quan-ly/phong/dat-phong-online",
        icon: <FaIcons.FaFirstOrder />,
        cName: "sub-nav",
      },
      {
        title: "Hóa đơn",
        path: "/quan-ly/phong/hoa-don",
        icon: <FaIcons.FaMoneyBill />,
        cName: "sub-nav",
      },
    ],
  },

  // Danh mục
  {
    title: "Danh mục",
    icon: <FaIcons.FaListUl />,
    role: ["Admin", "QL"],
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Nhà cung cấp",
        path: "/quan-ly/danh-muc/nha-cung-cap",
        icon: <DiIcons.DiOpensource />,
        cName: "sub-nav",
      },
      {
        title: "Nhân viên",
        path: "/quan-ly/danh-muc/nhan-vien",
        icon: <MdIcons.MdPeople />,
        cName: "sub-nav",
      },

      {
        title: "Dịch vụ",
        path: "/quan-ly/danh-muc/dich-vu",
        icon: <MdIcons.MdRoomService />,
        cName: "sub-nav",
      },

      {
        title: "Phòng",
        path: "/quan-ly/danh-muc/phong",
        icon: <FiIcons.FiHome />,
        cName: "sub-nav",
      },
    ],
  },

  //QL khách hàng
  {
    title: "QL Khách hàng",
    icon: <FaIcons.FaPeopleCarry />,
    role: ["Admin", "QL", "NVLT"],
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Kiểu khách hàng",
        path: "/quan-ly/ql-khach-hang/kieu",
        icon: <MdIcons.MdStyle />,
        cName: "sub-nav",
      },
      {
        title: "Khách hàng",
        path: "/quan-ly/ql-khach-hang/thong-tin",
        icon: <ImIcons.ImInfo />,
        cName: "sub-nav",
      },
    ],
  },

  // QL Tài sản
  {
    title: "QL Tài sản",
    icon: <MdIcons.MdWebAsset />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    role: ["Admin", "NVK", "QL"],
    subNav: [
      {
        title: "Tài sản",
        path: "/quan-ly/ql-tai-san/thong-tin",
        icon: <ImIcons.ImInfo />,
        cName: "sub-nav",
      },
      {
        title: "Bảo dưỡng",
        path: "/quan-ly/ql-tai-san/bao-duong",
        icon: <GiIcons.GiAutoRepair />,
        cName: "sub-nav",
      },
    ],
  },

  // QL Hàng hóa
  {
    title: "QL Hàng hóa",
    role: ["Admin", "NVK", "QL"],
    icon: <RiIcons.RiRedPacketLine />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Loại hàng",
        path: "/quan-ly/ql-hang-hoa/loai",
        icon: <MdIcons.MdStyle />,
        cName: "sub-nav",
      },
      {
        title: "Phiếu mua",
        path: "/quan-ly/ql-hang-hoa/phieu-mua",
        icon: <ImIcons.ImCart />,
        cName: "sub-nav",
      },
    ],
  },

  //QL nhân viên
  {
    title: "QL Nhân viên",
    icon: <FaIcons.FaPeopleCarry />,
    role: ["NVLT", "NVDP", "NVK"],
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Profile",
        path: "/quan-ly/nhan-vien/thong-tin",
        icon: <ImIcons.ImInfo />,
        cName: "sub-nav",
      },
      {
        title: "Xin nghỉ",
        path: "/quan-ly/nhan-vien/xin-nghi",
        icon: <BiIcons.BiPowerOff />,
        cName: "sub-nav",
      },
      {
        title: "Bảng lương",
        path: "/quan-ly/nhan-vien/bang-luong",
        icon: <FaIcons.FaMoneyBillAlt />,
        cName: "sub-nav",
      },
    ],
  },

  //NV Quản lý
  {
    title: "NV Quản lý",
    icon: <MdIcons.MdPeople />,
    role: ["Admin", "QL"],
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Duyệt đơn",
        path: "/quan-ly/nv-quan-ly/duyet-don",
        icon: <GiIcons.GiConfirmed />,
        cName: "sub-nav",
      },
      {
        title: "Chấm công NV",
        path: "/quan-ly/nv-quan-ly/cham-cong-nv",
        icon: <HiIcons.HiOutlineDocumentReport />,
        cName: "sub-nav",
      },
    ],
  },
];