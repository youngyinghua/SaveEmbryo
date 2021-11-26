import React, { useState } from "react";
import "./Modify.style.css";
import axios from "axios";

const Modify = () => {
  const [modifyInfo, setModifyInfo] = useState({
    id: "",
    name: "",
    birthday: "",
    opu_day: "",
    frozen_day: "",
    expire_day: "",
    tank: "",
    canister: "",
    cane: "",
    embryo_id: "",
    embryo_stage: "",
    quantity: "",
    color: "",
    thaw_day: "",
    extend_times: "",
    mail_day: "",
    note: "",
    url: "",
    alert: "",
    resData: [],
  });
  const {
    id,
    name,
    birthday,
    opu_day,
    frozen_day,
    expire_day,
    tank,
    canister,
    embryo_id,
    embryo_stage,
    quantity,
    color,
    thaw_day,
    cane,
    note,
    extend_times,
    mail_day,
    url,
    alert,
    resData,
  } = modifyInfo;

  console.log(modifyInfo);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (value.includes(",")) return window.alert("コンマ(,)使用禁止！");
    setModifyInfo((preState) => ({ ...preState, [name]: value }));
  };

  const handleButton = (e) => {
    e.preventDefault();
    if (!embryo_id) {
      return setModifyInfo((preState) => ({
        ...preState,
        alert: "入力してください",
      }));
    }

    if (!/^\d+$/.test(embryo_id)) {
      return setModifyInfo((preState) => ({
        ...preState,
        alert: "正しく入力してください",
      }));
    }

    return axios
      .post("https://embcryo-api.herokuapp.com/modify/search", { embryo_id })
      .then((response) => {
        if (response.data.length === 0) {
          return setModifyInfo((preState) => ({
            ...preState,
            resData: [],
            alert: "探したがなさそう",
          }));
        }
        setModifyInfo((preState) => ({
          ...preState,
          ...response.data[0],
          resData: response.data,
          alert: "修正したい項目を書き直してください(*必須項目)",
        }));
      })
      .catch((err) => console.log(err));
  };

  const uploadFile = () => {
    const file = document.getElementById("modify-upload").files[0];
    if (!file) return window.alert("ファイルを選択してください");
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let form = new FormData();
      form.append("image", btoa(reader.result));
      delete axios.defaults.headers.common["Authorization"];
      const apiUrl =
        "https://api.imgbb.com/1/upload?key=8b55e4bec5ab1a860b3a0d0a1ae2a8f1";
      // !fetch API not used in IE, so axios used
      // fetch(url, form).then(res => res.json())
      return axios
        .post(apiUrl, form)
        .then((response) => {
          const resData = response.data.data;
          setModifyInfo((preState) => ({ ...preState, url: resData.url }));
          window.alert("写真をuploadした");
        })
        .catch((err) => {
          window.alert("写真読み込んだがupload失敗");
          console.log(err);
        })
        .finally(() => {
          const token = window.sessionStorage.getItem("token");
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        });
    };
    reader.onerror = () => {
      window.alert("写真読み込み失敗");
      console.log(reader.error);
    };
  };

  const deleteUrl = () => {
    setModifyInfo((preState) => ({ ...preState, url: "" }));
  };

  const handleSubmitModify = () => {
    if (
      [
        id,
        name,
        birthday,
        opu_day,
        frozen_day,
        tank,
        canister,
        embryo_stage,
        quantity,
        color,
        cane,
      ].includes("")
    ) {
      return window.alert("必須項目記入してないところあり");
    }
    if (!/^\d{8}$/.test(id))
      return window.alert("患者番号は８桁数字ではないよ");
    if (!/^[A-H]$/.test(tank)) return window.alert("TankはA〜Hではないよ");
    if (!/^[1-6]$/.test(canister))
      return window.alert("Canisterは1~6ではないよ");
    if (!/^[1-6]$/.test(cane)) return window.alert("Caneは1~6ではないよ");
    if (!/^\d+$/.test(quantity)) return window.alert("個数は数字ではないよ");
    if (!/^\d+$/.test(extend_times))
      return window.alert("延期回数は数字ではないよ");
    if (
      !/^20\d\d\/0[1-9]$/.test(expire_day) &&
      !/^20\d\d\/1[0-2]$/.test(expire_day)
    )
      return window.alert("期限日YYYY/MMは正しくないよ");

    return axios
      .post("https://embcryo-api.herokuapp.com/modify/update", {
        embryo_id,
        data: {
          id,
          name,
          birthday,
          opu_day,
          frozen_day,
          expire_day,
          tank,
          canister,
          embryo_stage,
          quantity,
          color,
          thaw_day,
          cane,
          note,
          extend_times,
          mail_day,
          url,
        },
      })
      .then((response) => {
        if (response.data !== 1) {
          return window.alert("更新失敗");
        }
        return window.alert(`${response.data}行更新した`);
      })
      .catch((err) => console.log(err));
  };

  const cols1 = [
    ["*患者番号", "id", id],
    ["*名前", "name", name],
    ["*生年月日", "birthday", birthday],
    ["*採卵日", "opu_day", opu_day],
    ["*凍結日", "frozen_day", frozen_day],
  ];
  const cols2 = [
    ["*胚Grade", "embryo_stage", embryo_stage],
    ["*個数", "quantity", quantity],
    ["*色", "color", color],
    ["*Tank", "tank", tank],
    ["*Canst.", "canister", canister],
    ["*Cane", "cane", cane],
    ["融解日", "thaw_day", thaw_day],
    ["期限日", "expire_day", expire_day],
    ["延期回数", "extend_times", extend_times],
    ["郵送日", "mail_day", mail_day],
  ];

  const colsOfDate = [
    "opu_day",
    "frozen_day",
    "thaw_day",
    "birthday",
    "mail_day",
  ];
  return (
    <div className="modify">
      <div className="modify-search">
        <form onSubmit={handleButton}>
          <label>
            胚番号:{" "}
            <input
              id="embryo_id"
              name="embryo_id"
              type="number"
              value={embryo_id}
              onChange={handleChange}
              autoFocus
            />
          </label>
          <button className="check-button">検索</button>
        </form>
      </div>
      <div className="modify-output">
        <div className="modify-alert">{alert}</div>
        {resData.length ? (
          <>
            {" "}
            <table className="modify-table1">
              <thead>
                <tr>
                  {cols1.map((col) => (
                    <th key={col[0]}>{col[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {cols1.map((col) => {
                    if (colsOfDate.includes(col[1])) {
                      return (
                        <td key={col[1]}>
                          <input
                            type="date"
                            name={col[1]}
                            className="modify-col-date"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    if (col[1] === "id") {
                      return (
                        <td key={col[1]}>
                          <input
                            type="text"
                            name={col[1]}
                            className="modify-col-id"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    if (col[1] === "name" || col[1] === "embryo_stage") {
                      return (
                        <td key={col[1]}>
                          <input
                            type="text"
                            name={col[1]}
                            className="modify-col-long"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    return (
                      <td key={col[1]}>
                        <input
                          type="text"
                          name={col[1]}
                          className="modify-col"
                          onChange={handleChange}
                          value={col[2]}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <table className="modify-table2">
              <thead>
                <tr>
                  {cols2.map((col) => (
                    <th key={col[0]}>{col[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {cols2.map((col) => {
                    if (colsOfDate.includes(col[1])) {
                      return (
                        <td key={col[1]}>
                          <input
                            type="date"
                            name={col[1]}
                            className="modify-col-date"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    if (col[1] === "id") {
                      return (
                        <td key={col[1]}>
                          <input
                            type="text"
                            name={col[1]}
                            className="modify-col-id"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    if (col[1] === "name" || col[1] === "embryo_stage") {
                      return (
                        <td key={col[1]}>
                          <input
                            type="text"
                            name={col[1]}
                            className="modify-col-long"
                            onChange={handleChange}
                            value={col[2]}
                          />{" "}
                        </td>
                      );
                    }
                    return (
                      <td key={col[1]}>
                        <input
                          type="text"
                          name={col[1]}
                          className="modify-col"
                          onChange={handleChange}
                          value={col[2]}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <table className="modify-table3">
              <thead>
                <tr>
                  <th key="備考">備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="note">
                    <input
                      type="text"
                      name="note"
                      className="modify-col-longer"
                      onChange={handleChange}
                      value={note}
                    />{" "}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modify-image">
              {url && <img style={{ width: "280px" }} alt="embryo" src={url} />}{" "}
            </div>
            <div>
              <input type="file" id="modify-upload" accept="image/*" />
              <button onClick={uploadFile}>アップロード</button>
              <button className="modify-delete" onClick={deleteUrl}>
                画像削除
              </button>
            </div>
            <button
              className="submit-button md-bt"
              onClick={handleSubmitModify}
            >
              実行
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Modify;
