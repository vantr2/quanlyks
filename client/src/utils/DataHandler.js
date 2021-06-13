// const NormalizeDate = (date) => {
//   return (date + "").substring(0, 10).split("-").reverse().join("-");
// };

const NormalizeDate = (date) => {
  let d = new Date(date);
  return d.toLocaleDateString("vi-VN");
};

const convertTime = (dt) => {
  let d = new Date(dt);
  return d.toLocaleTimeString("vi-VN");
};

const convertDate = (date) => {
  let d = NormalizeDate(date);
  const arr = d.split("/");
  let result = arr[2] + "-";
  arr[1] < 10 ? (result += "0" + arr[1]) : (result += arr[1]);
  result += "-";
  arr[0] < 10 ? (result += "0" + arr[0]) : (result += arr[0]);
  return result;
};

const RenderGioiTinh = (i) => {
  let result = "";
  switch (i) {
    case 0:
      result = "Nữ";
      break;
    case 1:
      result = "Nam";
      break;
    case 2:
      result = "KXD";
      break;
    default:
      break;
  }
  return result;
};

const NumberFormat = (num) => {
  return (num + "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const CMNDFormat = (cmnd) => {
  return cmnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " - ");
};

const checkSpecialCharacter = (str) => {
  let regex = /`~,.<>;':"\/\[\]\|{}()=_+-]/;
  return regex.test(str);
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const dontSignEmail = (str) => {
  const english = /^[A-Za-z0-9@.]*$/;
  return english.test(str);
};

const convertDataTocreatableSelect = (arr) => {
  const result = [];
  arr.map((item) => {
    const obj = { value: item.id, label: item.name };
    result.push(obj);
    return item;
  });
  return result;
};

const dateInPast = (firstDate, secondDate) =>
  firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0);

const isWeekend = (date1, date2) => {
  var d1 = new Date(date1),
    d2 = new Date(date2),
    isWeekend = false,
    count = 0;

  while (d1 < d2) {
    var day = d1.getDay();
    isWeekend = day === 6 || day === 0;
    if (isWeekend) {
      count++;
    } // return immediately if weekend found
    d1.setDate(d1.getDate() + 1);
  }
  return count;
};

module.exports = {
  NormalizeDate,
  RenderGioiTinh,
  NumberFormat,
  CMNDFormat,
  checkSpecialCharacter,
  validateEmail,
  dontSignEmail,
  convertDataTocreatableSelect,
  dateInPast,
  convertDate,
  convertTime,
  isWeekend,
};
