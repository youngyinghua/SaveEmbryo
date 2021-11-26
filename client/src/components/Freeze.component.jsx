import React, { useState } from "react";
import Button from "./Button.componet";
import Table from "./Table.component";
import "./Freeze.style.css";
import { addAgeRows, getTankCountFromData, createExpireDay } from "../utils";
import UploadImage from "./UploadImage.component";
import axios from "axios";

const Freeze = () => {
  const [freezeInfo, setFreezeInfo] = useState({
    id: "",
    name: "",
    birthday: "",
    opu_day: "",
    frozen_day: new Date().toISOString().slice(0, 10),
    expire_day: createExpireDay(),
    tank: "",
    canister: "",
    cane: "",
    rows: [0],
    embryo_id: [""],
    embryo_stage: [""],
    quantity: [""],
    color: [""],
    note: [""],
    url: [""],
    showUploadArea: [false],
    alert: "",
    nextTank: "",
    nextCanister: "",
    searchId: "",
    dataFetchByID: [],
    dataFetchLatest: [],
    dataFetchTank: null,
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
    rows,
    embryo_id,
    embryo_stage,
    quantity,
    color,
    cane,
    note,
    url,
    showUploadArea,
    alert,
    nextTank,
    nextCanister,
    searchId,
    dataFetchByID,
    dataFetchLatest,
    dataFetchTank,
  } = freezeInfo;

  //console.log(freezeInfo);

  const handleCheck = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!/\d{8}/.test(id)) {
      window.alert("IDは８桁数字ではないよ");
      return;
    }
    setFreezeInfo((preState) => ({ ...preState, searchId: id }));
    return axios
      .post("https://embcryo-api.herokuapp.com/freeze/fetchbyid", { id })
      .then((response) => {
        if (response.data.length === 0) {
          return setFreezeInfo((preState) => ({
            ...preState,
            name: "",
            birthday: "",
            dataFetchByID: [],
            alert: "探したがなさそうです",
          }));
        }
        setFreezeInfo((preState) => ({
          ...preState,
          name: response.data[0].name,
          birthday: response.data[0].birthday.slice(0, 10),
          dataFetchByID: response.data,
          alert: "",
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e, row) => {
    const { value, name } = e.target;
    if (value.includes(",")) return window.alert("コンマ(,)使用禁止！");
    if (cols.includes(name)) {
      return setFreezeInfo((preState) => {
        let newArray = preState[name];
        newArray[row] = value;
        return { ...preState, [name]: newArray };
      });
    }
    if (name === "frozen_day") {
      return setFreezeInfo((preState) => ({
        ...preState,
        [name]: value,
        expire_day:
          (Number(value.slice(0, 4)) + 1).toString() + "/" + value.slice(5, 7),
      }));
    }
    return setFreezeInfo((preState) => ({ ...preState, [name]: value }));
  };

  const handleAddUploadArea = (row) => {
    return setFreezeInfo((preState) => {
      let newArea = preState.showUploadArea;
      newArea[row] = true;
      return {
        ...preState,
        showUploadArea: newArea,
      };
    });
  };

  const uploadFile = (index) => {
    const file = document.getElementById(`upload${index}`).files[0];
    if (!file) return window.alert("ファイルを選択してください");
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let form = new FormData();
      form.append("image", btoa(reader.result));
      console.log("process.env", process.env);
      const apiUrl =
        //`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`;
        "https://api.imgbb.com/1/upload?key=8b55e4bec5ab1a860b3a0d0a1ae2a8f1";
      // !fetch API not used in IE, so axios used
      delete axios.defaults.headers.common["Authorization"];
      return axios
        .post(apiUrl, form)
        .then((response) => {
          const resData = response.data.data;
          setFreezeInfo((preState) => {
            let newUrl = preState.url;
            newUrl[index] = resData.url;
            return { ...preState, url: newUrl };
          });
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

  const handleClickPlus = () => {
    if (rows.length > 3) return null;
    return setFreezeInfo((preState) => ({
      ...preState,
      rows: rows.concat(rows.length),
      embryo_id: embryo_id.concat(
        (dataFetchLatest[0].embryo_id + 1 + rows.length).toString()
      ),
      embryo_stage: embryo_stage.concat(""),
      quantity: quantity.concat(""),
      color: color.concat(""),
      note: note.concat(""),
      url: note.concat(""),
      showUploadArea: showUploadArea.concat(false),
    }));
  };

  const handleClickMinus = () => {
    if (rows.length < 2) return null;
    return setFreezeInfo((preState) => ({
      ...preState,
      rows: rows.slice(0, rows.length - 1),
      embryo_id: embryo_id.slice(0, rows.length - 1),
      embryo_stage: embryo_stage.slice(0, rows.length - 1),
      quantity: quantity.slice(0, rows.length - 1),
      color: color.slice(0, rows.length - 1),
      note: note.slice(0, rows.length - 1),
      url: url.slice(0, rows.length - 1),
      showUploadArea: showUploadArea.slice(0, rows.length - 1),
    }));
  };

  const handleClickTable = (tank, canister) => {
    setFreezeInfo((preState) => ({
      ...preState,
      tank,
      canister: canister.toString(),
    }));
  };

  const handleSubmit = () => {
    //check empty
    if (
      !(
        Boolean(id) &&
        Boolean(name) &&
        Boolean(birthday) &&
        Boolean(tank) &&
        Boolean(canister) &&
        Boolean(cane) &&
        Boolean(opu_day) &&
        Boolean(frozen_day) &&
        Boolean(expire_day)
      )
    )
      return window.alert("左に未入力あり");
    if ([...embryo_id, ...embryo_stage, ...quantity, ...color].includes(""))
      return window.alert("右に未入力あり");
    //check date sequence
    if (
      new Date(frozen_day) < new Date(opu_day) ||
      new Date(opu_day) < new Date(birthday) ||
      new Date(frozen_day) < new Date(birthday)
    ) {
      return window.alert("生年月日→採卵日→凍結日の前後順位に問題あり");
    }
    // check tank canister cane inputs format
    const checkArr1 = ["1", "2", "3", "4", "5", "6"];
    const checkArr2 = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ];
    if (
      checkArr1.indexOf(cane) === -1 ||
      checkArr1.indexOf(canister) === -1 ||
      checkArr2.indexOf(tank) === -1
    )
      return window.alert("Tank/Canister/Cane入力問題あり");
    //check embryo_id format and sequence
    let check_embryo_id = "";
    embryo_id.forEach((id) => {
      if (!/^[1-9]\d*$/.test(id))
        return (check_embryo_id = "凍結胚番号正しくない");
      if (
        Number(id) <= dataFetchLatest[0].embryo_id ||
        Number(id) > dataFetchLatest[0].embryo_id + rows.length
      )
        return (check_embryo_id =
          "凍結番号は最後の番号より小さいか番号飛ばすか");
    });
    if (check_embryo_id) return window.alert(check_embryo_id);
    //check embryo quantity format
    let check_quantity = "";
    quantity.forEach((qty) => {
      if (!/^[1-9]\d*$/.test(qty))
        return (check_quantity = "凍結胚数正しくない");
    });
    if (check_quantity) return window.alert(check_quantity);

    let insertRows = [];
    for (let i = 0; i < rows.length; i++) {
      insertRows.push({
        thaw_day: "",
        mail_day: "",
        id,
        name,
        embryo_id: Number(embryo_id[i]),
        birthday,
        tank: tank.toUpperCase(),
        canister,
        cane,
        opu_day,
        frozen_day,
        expire_day,
        embryo_stage: embryo_stage[i],
        quantity: quantity[i],
        color: color[i],
        note: note[i],
        url: url[i],
      });
    }
    insertRows = addAgeRows(insertRows);
    //console.log(insertRows);
    axios
      .post("https://embcryo-api.herokuapp.com/freeze/insert", {
        data: insertRows,
      })
      .then((response) => {
        if (response.data.rowCount) {
          setFreezeInfo((preState) => ({ ...preState, cane: "" }));
          handleCheck();
          window.alert(response.data.rowCount + "行書き込み完了！");
        } else {
          console.log(response.data);
          window.alert("書き込み失敗,Errorあり。よくある原因は凍結番号重複");
        }
      })
      .catch((err) => {
        console.log(err);
        window.alert("書き込み失敗!");
      });
  };

  const showLatest = () => {
    setFreezeInfo((preState) => ({
      ...preState,
      rows: rows.slice(0, 1),
      embryo_id: embryo_id.slice(0, 1),
      embryo_stage: embryo_stage.slice(0, 1),
      quantity: quantity.slice(0, 1),
      color: color.slice(0, 1),
      note: note.slice(0, 1),
      url: url.slice(0, 1),
      showUploadArea: showUploadArea.slice(0, 1),
    }));
    return axios
      .get("https://embcryo-api.herokuapp.com/freeze/fetchlatest")
      .then((response) => {
        setFreezeInfo((preState) => ({
          ...preState,
          dataFetchLatest: response.data,
          nextTank: toChooseNextTank[response.data[0].tank],
          embryo_id: [(response.data[0].embryo_id + 1).toString()],
        }));
      })
      .catch((err) => console.log(err, "問題あり、Get最後凍結胚失敗"));
  };

  const chooseTank = () => {
    return axios
      .get("https://embcryo-api.herokuapp.com/freeze/fetchtank")
      .then((response) => {
        const tankCountsForAll = getTankCountFromData(response.data);
        const tankCountsForNext = tankCountsForAll[nextTank];
        const nextcanister = tankCountsForNext.indexOf(
          Math.min(...tankCountsForNext.slice(1, 7))
        );
        setFreezeInfo((preState) => ({
          ...preState,
          dataFetchTank: tankCountsForAll,
          nextCanister: nextcanister,
          tank: nextTank,
          canister: nextcanister.toString(),
        }));
      })
      .catch((err) => console.log(err, "問題あり、GetTank一覧失敗"));
  };

  const cols = [
    "embryo_id",
    "embryo_stage",
    "quantity",
    "color",
    "note",
    "url",
  ];
  const tankRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const toChooseNextTank = {
    A: "B",
    B: "C",
    C: "D",
    D: "A",
    E: "A",
    F: "A",
    G: "A",
    H: "A",
  };

  return (
    <div className="freeze">
      <div className="freeze-inputs">
        <div className="freeze-info-input">
          <div className="freeze-id-input">
            <form className="freeze-id-form" onSubmit={handleCheck}>
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
            {dataFetchLatest.length ? (
              <button onClick={handleSubmit} className="submit-button">
                凍結
              </button>
            ) : null}
          </div>
          <div className="freeze-basic">
            <div className="freeze-basic-input1">
              <label>
                姓名:{" "}
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="ケイジン　ハナコ"
                  value={name}
                  onChange={handleChange}
                />
              </label>
              <label>
                生年月日:{" "}
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  placeholder="YYYYMMDD"
                  value={birthday}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div style={{ display: "flex" }}>
              <div className="freeze-basic-input2">
                <label>
                  採卵日:{" "}
                  <input
                    id="opu_day"
                    name="opu_day"
                    type="date"
                    placeholder="YYYYMMDD"
                    value={opu_day}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  凍結日:{" "}
                  <input
                    id="frozen_day"
                    name="frozen_day"
                    type="date"
                    placeholder="YYYYMMDD"
                    value={frozen_day}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  期限日:{" "}
                  <input
                    id="expire_day"
                    name="expire_day"
                    type="text"
                    placeholder="YYYY/MM"
                    value={expire_day}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="freeze-basic-input3">
                <label>
                  Tank:{" "}
                  <input
                    className="freeze-tank"
                    id="tank"
                    name="tank"
                    type="text"
                    placeholder="A~F"
                    value={tank}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Canister:{" "}
                  <input
                    className="freeze-canister"
                    id="canister"
                    name="canister"
                    type="number"
                    max="6"
                    min="1"
                    placeholder="1~6"
                    value={canister}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Cane:{" "}
                  <input
                    className="freeze-canister"
                    id="cane"
                    name="cane"
                    type="number"
                    max="6"
                    min="1"
                    placeholder="1~6"
                    value={cane}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="freeze-embryo-input">
          <table className="freeze-addembryo">
            <thead>
              <tr>
                <th>胚番号</th>
                <th>胚Stage</th>
                <th>数</th>
                <th>色</th>
                <th>備考</th>
                <th>画像</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  {cols.map((col) => {
                    if (col === "url") {
                      return (
                        <td key={row + col}>
                          <button onClick={() => handleAddUploadArea(row)}>
                            Upload
                          </button>
                        </td>
                      );
                    }
                    return (
                      <td key={row + col}>
                        <input
                          type="text"
                          className={`freeze-addembryo-input-${col}`}
                          name={col}
                          onChange={(e) => handleChange(e, row)}
                          value={freezeInfo[col][row]}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {dataFetchLatest.length ? (
            <div className="freeze-plus-minus">
              <button onClick={handleClickMinus} className="freeze-minus">
                -
              </button>
              <button onClick={handleClickPlus} className="freeze-plus">
                +
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        {searchId || dataFetchByID.length ? (
          <div className="freeze-form-legend">
            患者さん(ID:{searchId})の凍結保存胚
          </div>
        ) : null}
      </div>
      <div className="freeze-stock">
        {alert ? (
          <div> {alert} </div>
        ) : searchId ? (
          <Table
            data={dataFetchByID}
            title={[
              "採卵日",
              "凍結日",
              "胚＃",
              "胚評価",
              "数",
              "色",
              "Tank",
              "Cnst",
              "Cane",
              "備考",
            ]}
            seq={[
              "OPU_Day",
              "Frozen_Day",
              "Embryo_ID",
              "Embryo_Stage",
              "Quantity",
              "Color",
              "Tank",
              "Canister",
              "Cane",
              "Note",
            ]}
          />
        ) : null}
      </div>
      <div className="freeze-choose-tank">
        <div className="freeze-latest-tank-container">
          <Button handleButton={showLatest}>最後凍結胚情報GET</Button>
          {dataFetchLatest.length ? (
            <>
              <div>最後の凍結胚：</div>
              <div className="freeze-message">
                embryo_id#{dataFetchLatest[0].embryo_id}
              </div>
              <div>保存場所：</div>
              <div className="freeze-message">
                {dataFetchLatest[0].tank}-Tank
              </div>
              <div>&#8595;</div>
              <div>次の保存場所：</div>
              <div className="freeze-message">
                {nextTank}-{nextCanister}かも
              </div>
            </>
          ) : null}
        </div>
        <div className="freeze-tank-table-container">
          <Button handleButton={chooseTank}>TankのCanister本数一覧GET</Button>
          {dataFetchTank ? (
            <table className="freeze-tank-table">
              <thead>
                <tr>
                  <th>Tank</th>
                  <th>#1</th>
                  <th>#2</th>
                  <th>#3</th>
                  <th>#4</th>
                  <th>#5</th>
                  <th>#6</th>
                </tr>
              </thead>
              <tbody>
                {tankRows.map((row) => (
                  <tr key={row} className="freeze-tr">
                    {dataFetchTank[row].map((item, index) => {
                      if (typeof item === "string")
                        return (
                          <td key={row + index} className="freeze-first-col">
                            {item}
                          </td>
                        );
                      return (
                        <td
                          key={row + index}
                          className="freeze-other-cols"
                          onClick={() => handleClickTable(row, index)}
                        >
                          {item}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
      <div className="freeze-images">
        <div className="freeze-image">
          {showUploadArea[0] && (
            <UploadImage
              embryo_id={embryo_id}
              url={url}
              index={0}
              uploadFile={uploadFile}
            />
          )}
        </div>
        <div className="freeze-image">
          {showUploadArea[1] && (
            <UploadImage
              embryo_id={embryo_id}
              url={url}
              index={1}
              uploadFile={uploadFile}
            />
          )}
        </div>
        <div className="freeze-image">
          {showUploadArea[2] && (
            <UploadImage
              embryo_id={embryo_id}
              url={url}
              index={2}
              uploadFile={uploadFile}
            />
          )}
        </div>
        <div className="freeze-image">
          {showUploadArea[3] && (
            <UploadImage
              embryo_id={embryo_id}
              url={url}
              index={3}
              uploadFile={uploadFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Freeze;
