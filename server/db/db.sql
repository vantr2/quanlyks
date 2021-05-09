create database quanlykhachsan;
set client_encoding to 'utf-8';

create type role_list as enum('Admin','NVLT','KH','QL','NVK','NVDP');

create table tbl_nguoidung (
    ten varchar(100) primary key not null,
    mk varchar(100) not null,
    ten_hienthi varchar(200) not null,
    trangthai boolean default 'f',
    vaitro role_list default 'KH',
    avt varchar(500) default 'images/no-user.jpg'
);

insert into tbl_nguoidung (ten,mk,ten_hienthi,trangthai,vaitro) values('admin','van123','Tran Trong Van','t','Admin');

-- Nhan vien
create table tbl_nhanvien (
	id serial primary key not null,
	name varchar(300) not null,
    gioitinh int not null,
    ngaysinh date not null,
    diachi text not null,
    cmnd varchar(12) not null,
    sdt varchar(10) not null,
    email varchar(300),
    account varchar(100) unique,
    constraint fk_account
        foreign key (account)
            references tbl_nguoidung(ten)
            on delete set null
);

create table tbl_nhanvien_nghi (
    id serial primary key not null,
    khinao date not null,
    baolau int default 1 not null,
    lydo text,
    nhanvien_id int,
    trangthai int default 0, --cho xac nhan cua quan ly
    constraint fk_nhanvien
        foreign key (nhanvien_id) 
            references tbl_nhanvien(id)
            on delete set null
);


-- Nha cung cap
create table tbl_nhacc (
    id serial primary key not null,
    ten varchar(200) not null,
    diachi text not null,
    sdt varchar(10) not null,
    trangthai int not null default 1
);

-- TAI SAN
create table tbl_taisan_loai(
    id serial primary key not null,
    ten varchar(400) not null,
    -- soluong int default 0,
);

create table tbl_taisan (
    id serial primary key not null,
    ten varchar(400) not null,
    ghichu text,
    dongia numeric(10,0) not null check (dongia > 0),
    donvitinh varchar(100) not null,
    ngaymua date not null,
    vitri int,
    trangthai int not null default 1, -- con dung duoc khong 1 la ok 2 la hong
    nvtiepnhan int,
    loaitaisan_id int,
    nhacc_id int,
    constraint fk_ncc
        foreign key (nhacc_id) 
            references tbl_nhacc(id)
            on delete set null,
    constraint fk_loaitaisan
        foreign key (loaitaisan_id) 
            references tbl_taisan_loai(id)
            on delete set null,
    constraint fk_nvtiepnhan
        foreign key (nvtiepnhan) 
            references tbl_nhanvien(id)
            on delete set null
);

create table tbl_taisan_baoduong (
    id serial primary key not null,
    nguoibd varchar(400) not null,
    sdt varchar(10) not null,
    ngaybd date not null,
    ghichu text, -- ghi ra nhung thu da lam duoc
    nvtiepnhan int,
    tongtien numeric(10,0) not null default 0
    constraint fk_nvtiepnhan
        foreign key (nvtiepnhan) 
            references tbl_nhanvien(id)
            on delete set null
);

create table tbl_taisan_baoduong_chitiet (
    id serial primary key not null,
    taisanbd int,
    phibd numeric(8,0) not null,
    baoduong_id int,
    constraint fk_taisan
        foreign key (taisanbd) 
            references tbl_taisan(id)
            on delete set null,
    constraint fk_baoduong
        foreign key (baoduong_id) 
            references tbl_taisan_baoduong(id)
            on delete set null,
);


-- HANG HOA (BEP)
create table tbl_phieumua_loaihang(
    id serial primary key not null,
    ten varchar(400) not null
);

create table tbl_phieumua (
    id serial primary key not null,
    ngaymua date not null,
    tongtien numeric(10,0) not null default 0,
    nvtiepnhan int,
    ghichu text
);

create table tbl_phieumua_chitiet (
    id serial primary key not null,
    phieumua_id int,
    ten varchar(300) not null,
    dongia numeric(10,0) not null check (dongia > 0),
    donvitinh varchar(100) not null,
    loaihang_id int,
    nhacc_id int,
    constraint fk_ncc
        foreign key (nhacc_id) 
            references tbl_nhacc(id)
            on delete set null,
    constraint fk_loaihang
        foreign key (loaihang_id) 
            references tbl_phieumua_loaihang(id)
            on delete set null,
    constraint fk_phieumua
        foreign key (phieumua_id) 
            references tbl_phieumua(id)
            on delete set null
);

-- DICH VU
create table tbl_dichvu (
    id serial primary key not null,
    ten varchar(400) not null,
    ghichu text not null,
    giahientai numeric(10,0) not null,
    trangthai int not null default 1, -- con cung cap hay khong?
    anhminhhoa varchar(400)
 );

 -- KhACH HANG

create table tbl_khachhang_kieu (
    id serial primary key not null,
    ten varchar(400) not null
);

create table tbl_khachhang (
    id serial primary key not null,
    ten varchar(400) not null,
    cmnd varchar(12) not null,  -- nguoi chiu trach nhiem
    gioitinh int not null,
    ngaysinh date not null,
    diachi text not null,
    sdt varchar(10) not null,
    kieukhachhang_id int,
    account varchar(100), 
    constraint fk_account
        foreign key (account)
            references tbl_nguoidung(ten)
            on delete set null,
    constraint fk_kieukh
        foreign key (kieukhachhang_id)
            references tbl_khachhang_kieu(id)
            on delete set null
 );



--PHONG
create table tbl_phong (
    ten varchar(100) not null primary key,
    trangthai int not null default 0, -- 0 la san sang, 1 la da duoc thue, 2 la dang su dung,3 la checkout nhung chua don
    anh varchar(200) not null,
    tieude varchar(400) not null,
    mota_ngangon varchar(500) not null,
    mota_chitiet text not null, 
    giaphongtheongay numeric(10,0) not null default 0,
    giaphongtheogio numeric(10,0) not null default 0,
    filename varchar(100) not null,
);

alter table tbl_taisan add 
constraint fk_phong
        foreign key (vitri) 
            references tbl_phong(id)
            on delete set null

create table tbl_phong_hoadon (
    id serial primary key not null,
    khachhang_id int,
    trangthai int not null default 0, -- 0 la chua thanh toan, 1 la thanh toan roi
    phong_id int,
    giaphong numeric(10,0) not null,
    nguoitao varchar(100) not null,
    nguoisua varchar(100),
    hinhthucthanhtoan int not null default 0, -- 0 la tien mat, 1 la chuyen khoan
    vat int not null check (vat < 50 and vat > 0),
    tongtien numeric(10,0) not null default 0,
    constraint fk_khachhang
        foreign key (khachhang_id)
            references tbl_khachhang(id)
            on delete set null,
    constraint fk_phong
        foreign key (phong_id)
            references tbl_phong(id)
            on delete set null,
    constraint fk_nguoitao
        foreign key (nguoitao)
            references tbl_nguoidung(ten)
            on delete set null,
    constraint fk_nguoisua
        foreign key (nguoisua)
            references tbl_nguoidung(ten)
            on delete set null
);

create table tbl_phong_hoadon_chitiet (
    id serial primary key not null,
    hoadon_id int,
    dichvu_id int,
    giadichvu numeric(10,0) not null check (giadichvu > 0),
    soluong int,
    constraint fk_dichvu
        foreign key (dichvu_id)
            references tbl_dichvu(id)
            on delete set null,
    constraint fk_hoadon
        foreign key (hoadon_id)
            references tbl_phong_hoadon(id)
            on delete set null
);

-- DAT PHONG


create table tbl_datphong_online (
    id serial primary key not null,
    khachhang_id int,
    soluongkhach int not null default 1,
    soluongphong int not null default 1,
    ngaydat date default CURRENT_DATE,
    giodat time default CURRENT_TIME,
    ngaycheckin date not null,
    giocheckin time not null,
    ngaycheckout date not null,
    giocheckout time not null,
    trangthai int not null default 0, -- 0 la cho xac nhan, 1 la san sang
    constraint fk_khachhang
        foreign key (khachhang_id)
            references tbl_khachhang(id)
            on delete set null
);

--DOI PHONG
create table tbl_doiphong (
    id serial primary key not null,
    tuphong int,
    denphong int,
    lydo text not null,
    khachhang_id int,
    trangthai int not null default 0, -- 0 cho xac nhan, 1 da xac nhan doi xong  
    ngaydoi date default CURRENT_DATE,
    giodoi time default  CURRENT_TIME,
    nguoitao varchar(100),
    nguoisua varchar(100),
    constraint fk_khachhang
        foreign key (khachhang_id)
            references tbl_khachhang(id)
            on delete set null,
    constraint fk_tuphong
        foreign key (tuphong)
            references tbl_phong(id)
            on delete set null,
    constraint fk_denphong
        foreign key (denphong)
            references tbl_phong(id)
            on delete set null,
    constraint fk_nguoitao
        foreign key (nguoitao)
            references tbl_nguoidung(ten)
            on delete set null,
    constraint fk_nguoisua
        foreign key (nguoisua)
            references tbl_nguoidung(ten)
            on delete set null
);

--HUYPHONG
create table tbl_datphong_huyphong (
    id serial primary key not null,
    khachhang_id int,
    datphong_id int,
    lydo text not null,
    trangthai int not null default 0, -- 0 cho xac nhan, 1 da xac nhan doi xong  
    ngayhuy date default  CURRENT_DATE,
    giohuy time default CURRENT_TIME,
    nguoitao varchar(100),
    nguoisua varchar(100),
    constraint fk_khachhang
        foreign key (khachhang_id)
            references tbl_khachhang(id)
            on delete set null,
    constraint fk_datphong
        foreign key (datphong_id)
            references tbl_datphong_online(id)
            on delete set null,
    constraint fk_nguoitao
        foreign key (nguoitao)
            references tbl_nguoidung(ten)
            on delete set null,
    constraint fk_nguoisua
        foreign key (nguoisua)
            references tbl_nguoidung(ten)
            on delete set null
);



