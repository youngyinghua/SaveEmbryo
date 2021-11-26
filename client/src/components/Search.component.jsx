import React, { useState } from "react";
import axios from "axios";
import {
  dataForOtherGraph,
  dataForFiveYearGraph,
  dataForOneYearGraph,
} from "../utils";
import "./Search.style.css";
import Table from "./Table.component";
import { Bar } from "react-chartjs-2";
import Details from "./Details.component";

const Search = () => {
  const [inputs, setInputs] = useState({
    id: "",
    name: "",
    tank: "",
    imgInfo: {},
    data1: [],
    data2: [],
    data3: [],
    alert: "一箇所入力して検索する或は一覧で全て見る",
  });
  //console.log(inputs);
  const { id, name, tank, imgInfo, data1, data2, data3, alert } = inputs;
  const thisYear = new Date().getFullYear();
  const pastFiveYears = [
    thisYear - 4,
    thisYear - 3,
    thisYear - 2,
    thisYear - 1,
    thisYear,
  ];
  const pastFiveYearsWithKanji = pastFiveYears.map((year) => year + "年");
  const months = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];
  let graphdata1 = dataForOtherGraph(data1);
  let graphdata2 = dataForFiveYearGraph(data2);
  let graphdata3 = dataForOneYearGraph(data3);

  const graphData1 = {
    labels: graphdata1.opu_days,
    datasets: [
      {
        type: "bar",
        data: graphdata1.embqty_freeze,
        backgroundColor: "rgba(30, 144, 255, 0.5)",
        // barThickness: 40,
        label: "凍結",
      },
      {
        type: "bar",
        data: graphdata1.embqty_thaw,
        backgroundColor: "rgba(238, 130, 238, 0.5)",
        // barThickness: 40,
        label: "融解",
      },
    ],
  };

  const graphOption1 = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "採卵日",
            fontSize: 20,
          },
          ticks: {
            fontSize: 18,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "胚個数",
            fontSize: 20,
          },
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function (value, index, values) {
              if (Number.isInteger(value)) return `${value}`;
            },
          },
        },
      ],
    },
  };

  const graphData2 = {
    labels: pastFiveYearsWithKanji,
    datasets: [
      {
        type: "bar",
        yAxisID: "y-axis-embryo",
        data: graphdata2.embqty_freeze,
        backgroundColor: "rgba(30, 144, 255, 0.5)",
        label: "凍結胚数",
      },
      {
        type: "bar",
        yAxisID: "y-axis-embryo",
        data: graphdata2.embqty_thaw,
        backgroundColor: "rgba(238, 130, 238, 0.5)",
        label: "融解胚数",
      },
      {
        type: "line",
        yAxisID: "y-axis-person",
        data: graphdata2.times_freeze,
        label: "採卵回数",
        lineTension: 0,
        fill: false,
        borderColor: "rgba(0, 0, 255, 0.6)",
      },
      {
        type: "line",
        yAxisID: "y-axis-person",
        data: graphdata2.times_thaw,
        label: "融解回数",
        lineTension: 0,
        fill: false,
        borderColor: "rgba(255, 0, 255, 0.6)",
      },
    ],
  };

  const graphOption2 = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "",
            fontSize: 20,
          },
          ticks: {
            fontSize: 18,
            callback: function (value, index, values) {
              return `${value}`;
            },
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-embryo",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "胚(個)",
            fontSize: 20,
          },
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function (value, index, values) {
              if (Number.isInteger(value)) return `${value}`;
            },
          },
        },
        {
          id: "y-axis-person",
          position: "right",
          scaleLabel: {
            display: true,
            labelString: "回数",
            fontSize: 20,
          },
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function (value, index, values) {
              return `${value}`;
            },
          },
        },
      ],
    },
  };

  const graphData3 = {
    labels: months,
    datasets: [
      {
        type: "bar",
        yAxisID: "y-axis-embryo",
        data: graphdata3.embqty_freeze,
        backgroundColor: "rgba(30, 144, 255, 0.5)",
        label: "凍結胚数",
      },
      {
        type: "bar",
        yAxisID: "y-axis-embryo",
        data: graphdata3.embqty_thaw,
        backgroundColor: "rgba(238, 130, 238, 0.5)",
        label: "融解胚数",
      },
      {
        type: "line",
        yAxisID: "y-axis-person",
        data: graphdata3.times_freeze,
        label: "採卵回数",
        lineTension: 0,
        fill: false,
        borderColor: "rgba(0, 0, 255, 0.6)",
      },
      {
        type: "line",
        yAxisID: "y-axis-person",
        data: graphdata3.times_thaw,
        label: "融解回数",
        lineTension: 0,
        fill: false,
        borderColor: "rgba(255, 0, 255, 0.6)",
      },
    ],
  };

  const graphOption3 = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "",
            fontSize: 20,
          },
          ticks: {
            fontSize: 18,
            callback: function (value, index, values) {
              return `${value}`;
            },
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-embryo",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "胚(個)",
            fontSize: 20,
          },
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function (value, index, values) {
              if (Number.isInteger(value)) return `${value}`;
            },
          },
        },
        {
          id: "y-axis-person",
          position: "right",
          scaleLabel: {
            display: true,
            labelString: "回数",
            fontSize: 20,
          },
          ticks: {
            beginAtZero: true,
            fontSize: 18,
            callback: function (value, index, values) {
              if (Number.isInteger(value)) return `${value}`;
            },
          },
        },
      ],
    },
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    return setInputs((preState) => ({ ...preState, [name]: value }));
  };

  const handleUrl = (imgID, imgName, imgEmbryoID, imgUrl) => {
    return setInputs((preState) => ({
      ...preState,
      imgInfo: { imgID, imgName, imgEmbryoID, imgUrl },
    }));
  };

  const handleButton = (e) => {
    const allInpt = Boolean(id) + Boolean(name) + Boolean(tank);
    e.preventDefault(); //! stop reset form after sumbit.
    if (allInpt !== 1) {
      return setInputs((preState) => ({
        ...preState,
        alert: "一箇所入力してね",
        data1: [],
      }));
    }
    if (id) {
      if (!/\d{8}/.test(id)) {
        return setInputs((preState) => ({
          ...preState,
          alert: "idは８桁数字ではないよ",
          data1: [],
        }));
      }
    }

    return axios
      .post("https://embcryo-api.herokuapp.com/search", {
        id,
        name,
        tank,
      })
      .then((response) => {
        if (response.data.length === 0) {
          return setInputs((preState) => ({
            ...preState,
            alert: "探したがなさそう",
            data1: [],
          }));
        }
        setInputs((preState) => ({
          ...preState,
          data1: response.data,
          data2: [],
          data3: [],
          alert: "",
          imgInfo: {},
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleClickLast50 = () => {
    return axios
      .get("https://embcryo-api.herokuapp.com/search-last50")
      .then((response) => {
        if (response.data.length === 0) {
          return setInputs((preState) => ({
            ...preState,
            alert: "探したがなさそう",
          }));
        }
        setInputs((preState) => ({
          ...preState,
          id: "",
          name: "",
          tank: "",
          data1: response.data.reverse(),
          data2: [],
          data3: [],
          imgInfo: {},
          alert: "",
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleClick5Years = () => {
    return axios
      .get("https://embcryo-api.herokuapp.com/search-last5years")
      .then((response) => {
        if (response.data.length === 0) {
          return setInputs((preState) => ({
            ...preState,
            alert: "探したがなさそう",
          }));
        }
        const filterData = response.data.filter((row) =>
          pastFiveYears.includes(new Date(row.opu_day).getFullYear())
        );
        setInputs((preState) => ({
          ...preState,
          id: "",
          name: "",
          tank: "",
          data1: [],
          data2: filterData,
          alert: "",
          info: {},
          imgInfo: {},
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleClickOneYear = (year) => {
    const index = pastFiveYears.indexOf(year);
    setInputs((preState) => ({
      ...preState,
      data3: graphdata2.eachYearData[index],
    }));
  };

  return (
    <div className="search">
      <div className="search-inputs">
        <div className="search-space"></div>
        <div className="search-id">
          <form onSubmit={handleButton}>
            <label>
              ID:{" "}
              <input
                id="id"
                name="id"
                className="search-id-input"
                type="number"
                placeholder="12345678"
                max="99999999"
                value={id}
                onChange={handleChange}
                autoFocus
              />
            </label>
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
              タンク:{" "}
              <input
                id="tank"
                name="tank"
                className="search-tank-input"
                type="text"
                placeholder="A1"
                value={tank}
                onChange={handleChange}
              />
            </label>
            <button className="check-button" type="submit">
              検索
            </button>
          </form>
          <div className="search-add-space"></div>
          <button className="check-button" onClick={handleClickLast50}>
            一覧
            <br />
            (Last 50)
          </button>
          <button className="check-button" onClick={handleClick5Years}>
            一覧
            <br />
            (5年間)
          </button>
        </div>
        <div className="search-space">
          {data1.length ? <Details data={data1} /> : null}
        </div>
      </div>
      {alert ? (
        <div className="alert"> {alert} </div>
      ) : data1.length ? (
        <Table
          data={data1}
          title={[
            "ID",
            "氏名",
            "生年月日",
            "採卵日",
            "凍結日",
            "胚＃",
            "胚評価",
            "数",
            "Tank",
            "Cnst",
            "融解日",
            "期限日",
            "備考",
            "画像",
          ]}
          seq={[
            "ID",
            "Name",
            "Birthday",
            "OPU_Day",
            "Frozen_Day",
            "Embryo_ID",
            "Embryo_Stage",
            "Quantity",
            "Tank",
            "Canister",
            "Thaw_Day",
            "Expire_Day",
            "Note",
            "Url",
          ]}
          handleUrl={handleUrl}
        />
      ) : null}
      {data1.length ? (
        <div className="search-graphandimage">
          <div className="search-image">
            {imgInfo.imgUrl && (
              <>
                <img
                  style={{ width: "450px" }}
                  alt="embryo"
                  src={imgInfo.imgUrl}
                />
                <div>
                  {`ID:${imgInfo.imgID} \xa0\xa0\xa0 氏名:${imgInfo.imgName} \xa0\xa0\xa0 #${imgInfo.imgEmbryoID}`}{" "}
                </div>
              </>
            )}
          </div>
          <div className="search-graph">
            <Bar data={graphData1} options={graphOption1} />
          </div>
        </div>
      ) : null}
      {data2.length ? (
        <div className="search-graphandimage">
          <div className="search-graph2-container">
            <div className="search-image">
              {imgInfo.imgUrl && (
                <img
                  style={{ width: "450px" }}
                  alt="embryo"
                  src={imgInfo.imgUrl}
                />
              )}
            </div>
            <div className="search-graph2">
              <Bar data={graphData2} options={graphOption2} />
            </div>
            {data2.length ? <Details data={data2} /> : null}
          </div>
          <div className="search-graph3-container">
            <div className="search-graph3-btn">
              {pastFiveYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleClickOneYear(year)}
                >{`${year}年`}</button>
              ))}{" "}
            </div>
            <div className="search-graph3">
              {" "}
              {data3.length ? (
                <Bar data={graphData3} options={graphOption3} />
              ) : null}
            </div>
            {data3.length ? <Details data={data3} /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
