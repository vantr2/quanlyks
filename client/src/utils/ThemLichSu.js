import LichSuFinder from "../apis/LichSuFinder";

const ThemLichSu = async (bundle) => {
  try {
    await LichSuFinder.post("/them", {
      nguoithuchien: window.localStorage.getItem("user_name"),
      vaitro: window.localStorage.getItem("user_role"),
      hanhdong: bundle.doing,
      dulieucu: JSON.stringify(bundle.olddata),
      dulieumoi: JSON.stringify(bundle.newdata),
      doituong: bundle.tbl,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export default ThemLichSu;
