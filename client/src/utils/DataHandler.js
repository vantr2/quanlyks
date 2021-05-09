const NormalizeDate = (date) => {
  return (date + "").substring(0, 10).split("-").reverse().join("-");
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
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

module.exports = {
  NormalizeDate,
  RenderGioiTinh,
  NumberFormat,
  CMNDFormat,
  checkSpecialCharacter,
  validateEmail,
  dontSignEmail,
  convertDataTocreatableSelect,
};
