import axios from "axios";
import React, { useState } from "react";
import { countDetails } from "../utils";
import Button from "./Button.componet";
import Table from "./Table.component";
import "./Thaw.style.css";

const Thaw = () => {
  const [thawInfo, setThawInfo] = useState({
    id: "",
    name: "",
    birthday: "",
    tank: "",
    canister: "",
    cane: "",
    embryo_id: "",
    nextStep: false,
    thaw_day: new Date().toISOString().slice(0, 10),
    note: "",
    alert1: "",
    alert2: "",
    dataFetchByID: [],
  });
  const {
    id,
    name,
    birthday,
    tank,
    canister,
    embryo_id,
    nextStep,
    thaw_day,
    note,
    alert1,
    alert2,
    dataFetchByID,
  } = thawInfo;

  //console.log(thawInfo);

  const handleCheck = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!/\d{8}/.test(id)) {
      return setThawInfo((preState) => ({
        ...preState,
        alert1: "IDは８桁数字ではないよ",
      }));
    }
    setThawInfo((preState) => ({ ...preState, searchId: id }));
    return axios
      .post("https://embcryo-api.herokuapp.com/freeze/fetchbyid", { id })
      .then((response) => {
        if (response.data.length === 0) {
          return setThawInfo((preState) => ({
            ...preState,
            name: "",
            birthday: "",
            dataFetchByID: [],
            alert1:
              "探したがこの患者さんは既存胚がない、或はこの患者さんがいない",
          }));
        }
        setThawInfo((preState) => ({
          ...preState,
          name: response.data[0].name,
          birthday: response.data[0].birthday.slice(0, 10),
          dataFetchByID: response.data,
          alert1: "",
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e, row) => {
    const { value, name } = e.target;
    if (value.includes(",")) return window.alert("コンマ(,)使用禁止！");
    return setThawInfo((preState) => ({ ...preState, [name]: value }));
  };

  const handleNextStep = () => {
    if (!embryo_id) {
      return setThawInfo((preState) => ({
        ...preState,
        alert2: "胚をひとつ選んでください",
      }));
    }
    setThawInfo((preState) => ({ ...preState, nextStep: true, alert2: "" }));
  };

  const handleSubmitThaw = () => {
    const checkArr1 = ["1", "2", "3", "4", "5", "6"];
    const checkArr2 = ["A", "B", "C", "D", "E", "F", "G", "H"];
    if (canister) {
      if (!checkArr1.includes(canister))
        return window.alert("Canisterが1-6ではない");
    }
    if (tank) {
      if (!checkArr2.includes(tank)) return window.alert("TankがA-Hではない");
    }

    const updateRow = !note
      ? { thaw_day }
      : tank
      ? { thaw_day, tank, canister, note }
      : { thaw_day, note };

    axios
      .post("https://embcryo-api.herokuapp.com/thaw/update", {
        data: updateRow,
        embryo_id,
      })
      .then((response) => {
        window.alert(response.data + "行更新完了！");
        setThawInfo((preState) => ({
          ...preState,
          embryo_id: "",
          nextStep: false,
        }));
        handleCheck();
      })
      .catch((err) => {
        console.log(err);
        window.alert("更新失敗!");
      });
  };

  return (
    <div className="th">
      <div className="th-header">
        <div className="th-id">
          <form onSubmit={handleCheck}>
            <label>
              ID:{" "}
              <input
                id="id"
                name="id"
                type="number"
                placeholder="12345678"
                max="99999999"
                value={id}
                onChange={handleChange}
                autoFocus
              />
            </label>
            <button className="check-button">検索</button>
          </form>
        </div>
      </div>
      <div className="th-body">
        {dataFetchByID.length || alert1 ? (
          <div className="th-outputs">
            {dataFetchByID.length ? (
              <div className="th-output1">
                <p className="th-output1-title">姓名:</p>
                <p className="th-output1-value">{name}</p>
                <p className="th-output1-title">生年月日:</p>
                <p className="th-output1-value">
                  {birthday.replaceAll(/-/g, "/")}
                </p>
                <p className="th-output1-title">年齢:</p>
                <p className="th-output1-value">
                  {Math.floor((new Date() - new Date(birthday)) / 31536000000)}
                </p>
                <p className="th-output1-title">歳</p>
                <p className="th-output1-title">残り胚:</p>
                <p className="th-output1-value">
                  {countDetails(dataFetchByID).embryoSum}
                </p>
                <p className="th-output1-title">個</p>
              </div>
            ) : null}
            <div className="th-output2">
              {alert1 ? (
                <div className="alert"> {alert1} </div>
              ) : (
                <Table
                  data={dataFetchByID}
                  title={[
                    "選択",
                    "胚＃",
                    "胚評価",
                    "数",
                    "Tank",
                    "Cnst",
                    "Cane",
                    "色",
                    "胚年齢",
                    "採卵日",
                    "凍結日",
                    "期限日",
                    "備考",
                  ]}
                  seq={[
                    "Select",
                    "Embryo_ID",
                    "Embryo_Stage",
                    "Quantity",
                    "Tank",
                    "Canister",
                    "Cane",
                    "Color",
                    "Embryo_Age",
                    "OPU_Day",
                    "Frozen_Day",
                    "Expire_Day",
                    "Note",
                  ]}
                  handleTable={handleChange}
                />
              )}
            </div>
          </div>
        ) : null}
        <div className="th-inputs">
          <div className="th-input1">
            {dataFetchByID.length ? (
              <Button handleButton={handleNextStep}>融解に進む</Button>
            ) : null}
            {alert2 ? <div className="alert">{alert2}</div> : null}
          </div>
          <div className="th-input2">
            {nextStep ? (
              <div>
                <div>&#8595;</div>
                <div>
                  <label>
                    融解日:{" "}
                    <input
                      id="thaw_day"
                      name="thaw_day"
                      type="date"
                      value={thaw_day}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Tank:{" "}
                    <input
                      id="tank"
                      name="tank"
                      type="text"
                      placeholder="廃棄の場合記入"
                      value={tank}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Canister:{" "}
                    <input
                      id="canister"
                      name="canister"
                      style={{ width: "120px" }}
                      type="number"
                      max="6"
                      min="1"
                      placeholder="廃棄の場合記入"
                      value={canister}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Note:{" "}
                    <input
                      id="note"
                      name="note"
                      type="text"
                      value={note}
                      placeholder="例：廃棄・XXXへ移管"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          {nextStep ? (
            <button className="submit-button" onClick={handleSubmitThaw}>
              実行
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Thaw;
