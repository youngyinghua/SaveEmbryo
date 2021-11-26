import React, { useState } from "react";
import { createExpireDay, findAndPlusExpireDayAndExtendTimes } from "../utils";
import Button from "./Button.componet";
import Table from "./Table.component";
import "./Expire.style.css";
import axios from "axios";

const Expire = () => {
  const [exState, setExState] = useState({
    exInput: createExpireDay(),
    idInput: "",
    dataFetchById: [],
    dataFetchByExpireDay: [],
    idAndOpu_day1: "",
    idAndOpu_day2: "",
    mail_day: new Date().toISOString().slice(0, 10),
    expire_day: "",
    extend_times: "",
    nextStep1: false,
    nextStep2: false,
    alert1: "",
    alert2: "",
    alert3: "",
    alert4: "",
  });

  const {
    exInput,
    idInput,
    dataFetchById,
    dataFetchByExpireDay,
    idAndOpu_day1,
    idAndOpu_day2,
    nextStep1,
    nextStep2,
    mail_day,
    expire_day,
    extend_times,
    alert1,
    alert2,
    alert3,
    alert4,
  } = exState;
  //console.log(exState);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setExState((preState) => ({ ...preState, [name]: value }));
  };

  const handleCheckExpireDay = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!exInput) {
      return setExState((preState) => ({
        ...preState,
        alert1: "期限日を入力してください",
        dataFetchByExpireDay: [],
        idAndOpu_day1: "",
        nextStep1: false,
      }));
    }

    if (
      !/^20\d\d\/0[1-9]$/.test(exInput) &&
      !/^20\d\d\/1[0-2]$/.test(exInput)
    ) {
      return setExState((preState) => ({
        ...preState,
        alert1: "期限日を正しく入力してください",
        dataFetchByExpireDay: [],
        idAndOpu_day1: "",
        nextStep1: false,
      }));
    }

    return axios
      .post("https://embcryo-api.herokuapp.com/expire/searchexpire", {
        expire_day: exInput,
      })
      .then((response) => {
        if (response.data.length === 0) {
          return setExState((preState) => ({
            ...preState,
            dataFetchByExpireDay: [],
            idAndOpu_day1: "",
            nextStep1: false,
            alert1: "探したがなさそう",
          }));
        }
        setExState((preState) => ({
          ...preState,
          dataFetchByExpireDay: response.data,
          alert1: "",
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleCheckId = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!idInput) {
      return setExState((preState) => ({
        ...preState,
        alert3: "idを入力してください",
        dataFetchById: [],
      }));
    }

    if (!/^\d{8}$/.test(idInput)) {
      return setExState((preState) => ({
        ...preState,
        alert3: "idを8桁数字で入力してください",
        dataFetchById: [],
        nextStep2: false,
      }));
    }

    return axios
      .post("https://embcryo-api.herokuapp.com/expire/searchid", {
        id: idInput,
      })
      .then((response) => {
        if (response.data.length === 0) {
          return setExState((preState) => ({
            ...preState,
            dataFetchById: [],
            nextStep2: false,
            alert3: "探したがなさそう",
          }));
        }
        setExState((preState) => ({
          ...preState,
          dataFetchById: response.data,
          alert3: "",
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleNextStep1 = () => {
    if (idAndOpu_day1 === "") {
      return window.alert("行をひとつ選んでください");
    }
    setExState((preState) => ({ ...preState, nextStep1: true }));
  };

  const handleNextStep2 = () => {
    if (idAndOpu_day2 === "") {
      return window.alert("行をひとつ選んでください");
    }
    const opuday = idAndOpu_day2.slice(1);
    const newExpireData = findAndPlusExpireDayAndExtendTimes(
      dataFetchById,
      opuday
    );
    return setExState((preState) => ({
      ...preState,
      nextStep2: true,
      expire_day: newExpireData[0],
      extend_times: newExpireData[1],
    }));
  };

  const handleSubmitExpire = () => {
    if (!mail_day) {
      return setExState((preState) => ({
        ...preState,
        alert2: "郵送日を入力してください",
      }));
    }
    const id = idAndOpu_day1.slice(0, 8);
    const opu_day = idAndOpu_day1.slice(9);
    return axios
      .post("https://embcryo-api.herokuapp.com/expire/updatemail", {
        mail_day,
        id,
        opu_day,
      })
      .then((response) => {
        window.alert(`id:${id}　採卵日:${opu_day}由来　計胚　${response.data}　個分
          の郵送日を更新しました`);
        handleCheckExpireDay();
      })
      .catch((err) => {
        console.log(err);
        window.alert("ーERRORー更新できません");
      });
  };

  const handleSubmitExpire2 = () => {
    if (!expire_day) {
      return setExState((preState) => ({
        ...preState,
        alert4: "期限日を入力してください",
      }));
    }

    if (!extend_times) {
      return setExState((preState) => ({
        ...preState,
        alert4: "延期回数を入力してください",
      }));
    }

    if (
      !/^20\d\d\/0[1-9]$/.test(expire_day) &&
      !/^20\d\d\/1[0-2]$/.test(expire_day)
    ) {
      return setExState((preState) => ({
        ...preState,
        alert4: "期限日を正しく入力してください",
        nextStep2: true,
      }));
    }
    if (Number(extend_times) < 0) {
      return setExState((preState) => ({
        ...preState,
        alert4: "延期回数を正確に入力してください",
      }));
    }

    const id = idInput;
    const opu_day = idAndOpu_day2.slice(1);
    return axios
      .post("https://embcryo-api.herokuapp.com/expire/updateexpireday", {
        expire_day,
        extend_times,
        id,
        opu_day,
      })
      .then((response) => {
        window.alert(`id:${id}　採卵日:${opu_day} 由来　計胚　${response.data}　個分
          の期限日を更新しました`);
        handleCheckId();
      })
      .catch((err) => {
        console.log(err);
        window.alert("ーERRORー更新できません");
      });
  };

  return (
    <div className="ex">
      <div className="ex-title">郵送日記入</div>
      <div className="ex-search">
        <form onSubmit={handleCheckExpireDay}>
          <label className="ex-search-label">
            凍結期限日:{" "}
            <input
              className="ex-search-input"
              name="exInput"
              type="text"
              placeholder="YYYY/MM"
              value={exInput}
              onChange={handleChange}
              autoFocus
            />
          </label>
          <button className="check-button">検索</button>
        </form>
      </div>
      <div className="ex-table">
        {alert1 ? <div className="alert"> {alert1} </div> : null}{" "}
        {dataFetchByExpireDay.length ? (
          <Table
            data={dataFetchByExpireDay}
            title={[
              "選択",
              "ID",
              "氏名",
              "生年月日",
              "採卵日",
              "胚総数",
              "延期回数",
              "郵送日",
            ]}
            seq={[
              "選択1",
              "ID",
              "Name",
              "Birthday",
              "OPU_Day",
              "Embryo_Num",
              "Extend_Times",
              "Mail_Day",
            ]}
            handleTable={handleChange}
          />
        ) : null}
      </div>
      <div className="ex-input">
        <div className="ex-input1">
          {idAndOpu_day1.length && dataFetchByExpireDay.length ? (
            <Button handleButton={handleNextStep1}>郵送日記入</Button>
          ) : null}
        </div>
        <div className="ex-input2">
          {nextStep1 ? (
            <div>
              <div>&#8595;</div>
              <div>
                <label>
                  郵送日:{" "}
                  <input
                    id="mail_day"
                    name="mail_day"
                    type="date"
                    value={mail_day}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        {nextStep1 ? (
          <button className="submit" onClick={handleSubmitExpire}>
            実行
          </button>
        ) : null}
      </div>
      <div className="ex-alert alert">{alert2 ? alert2 : null} </div>
      <hr className="ex-divide"></hr>
      <div className="ex-title">延期手続き</div>
      <div className="ex-search">
        <form onSubmit={handleCheckId}>
          <label className="ex-search-label">
            患者ID:{" "}
            <input
              className="ex-search-input"
              id="id"
              name="idInput"
              type="number"
              placeholder="12345678"
              value={idInput}
              onChange={handleChange}
            />
          </label>
          <button className="check-button">検索</button>
        </form>
      </div>
      <div className="ex-table">
        {alert3 ? <div className="alert"> {alert3} </div> : null}{" "}
        {dataFetchById.length ? (
          <Table
            data={dataFetchById}
            title={[
              "選択",
              "氏名",
              "生年月日",
              "採卵日",
              "胚総数",
              "期限日",
              "延期回数",
              "郵送日",
            ]}
            seq={[
              "選択2",
              "Name",
              "Birthday",
              "OPU_Day",
              "Embryo_Num",
              "Expire_Day",
              "Extend_Times",
              "Mail_Day",
            ]}
            handleTable={handleChange}
          />
        ) : null}
      </div>
      <div className="ex-input">
        <div className="ex-input1">
          {idAndOpu_day2.length && dataFetchById.length ? (
            <Button handleButton={handleNextStep2}>期限日を延期</Button>
          ) : null}
        </div>
        <div className="ex-input2">
          {nextStep2 ? (
            <div>
              <div>&#8595;</div>
              <div>
                <label>
                  新しい期限日:{" "}
                  <input
                    className="ex-new-expireday"
                    name="expire_day"
                    type="text"
                    value={expire_day}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  延期回数:{" "}
                  <input
                    className="ex-new-extendtimes"
                    name="extend_times"
                    type="number"
                    value={extend_times}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div>
        {nextStep2 ? (
          <button className="submit" onClick={handleSubmitExpire2}>
            実行
          </button>
        ) : null}
      </div>
      <div className="ex-alert alert">{alert4 ? alert4 : null} </div>
    </div>
  );
};

export default Expire;
