import axios from "axios";
import Server from "../hosts/Server";

export default axios.create({
  baseURL: Server + "/CapNhapGioCongNhanVien",
});