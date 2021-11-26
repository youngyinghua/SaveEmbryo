import React from "react";
import "./Backup.style.css";
import db_logo from "../assets/database-logo.png";
import arrow_logo from "../assets/arrow-logo.png";
import axios from "axios";

// ! IMPORTANT 1. export to csv, avoid first phrase of first row(header) being ID,
//! when using ID, excel will consider the csv as a SYLK file, which influence subsequent
//! thransformation from csv to jason. the csv will not recognize \n.
//! IMPORTANT 2. Aoiding using comma (',') in databse input. exp. 5 cell, 6 cell will be
//! seem as two columns when converted to csv during export.

const Backup = () => {
  function download_csv(csv, filename) {
    let csvFile;
    let downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }

  const cols = [
    "id",
    "name",
    "birthday",
    "opu_day",
    "frozen_day",
    "embryo_id",
    "embryo_age",
    "embryo_stage",
    "quantity",
    "color",
    "tank",
    "canister",
    "cane",
    "expire_day",
    "mail_day",
    "extend_times",
    "thaw_day",
    "note",
    "url",
  ];

  const jasonToCsv = (data) => {
    const header = [
      "患者ID",
      "氏名",
      "生年月日",
      "採卵日",
      "凍結日",
      "胚＃",
      "胚年齢",
      "胚評価",
      "数",
      "色",
      "Tank",
      "Cnst",
      "cane",
      "期限日",
      "郵送日",
      "延期回数",
      "融解日",
      "備考",
      "画像URL",
    ];
    let csv = [];
    csv.push(header.join(","));
    data.forEach((row) => {
      let csvRow = cols.map((col) => row[col]);
      csv.push(csvRow.join(","));
    });
    return csv.join("\n");
  };

  const csvToJason = (data) => {
    let jason = [];
    const rows = data.split("\n");
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");
      let obj = {};
      for (let j = 0; j < row.length; j++) {
        obj[cols[j]] = row[j];
      }
      jason.push(obj);
    }
    return jason;
  };

  const handleExport = () => {
    return axios
      .get("https://embcryo-api.herokuapp.com/backup/search")
      .then((response) => {
        if (response.data.length === 0) {
          return window.alert("databaseを探したが空です");
        }
        let csv = jasonToCsv(response.data);
        const today = new Date().toISOString().slice(0, 10);
        download_csv([csv], `${today}-embryo.csv`);
      })
      .catch((err) => console.log(err));
  };

  const handleImportSubmit = () => {
    const selectedFile = document.getElementById("import").files[0];
    if (!selectedFile) return window.alert("ファイルを選択してください");
    return selectedFile
      .text()
      .then((data) => {
        const jasonData = csvToJason(data);
        return axios
          .post("https://embcryo-api.herokuapp.com/backup/recover", {
            data: jasonData,
          })
          .then((response) => {
            if (response.data.rowCount) {
              window.alert(response.data.rowCount + "行置き換え完了！");
            } else {
              console.log(response.data);
              window.alert("置き換え失敗,Errorあり");
            }
          })
          .catch((err) => {
            console.log(err);
            window.alert("置き換え失敗!");
          });
      })
      .catch((err) => {
        window.alert("-ERROR-");
        console.log(err);
      });
  };

  return (
    <div className="backup">
      <div className="backup-export">
        {" "}
        <button className="submit-button backup-submit" onClick={handleExport}>
          Export実行
        </button>
        <img src={arrow_logo} alt="arrow" className="arrow-icon export-arrow" />
      </div>
      <div className="backup-db">
        {" "}
        <img src={db_logo} alt="database" className="db-icon" />
        <p className="db-text">データベース</p>
      </div>
      <div className="backup-import">
        {" "}
        <img src={arrow_logo} alt="arrow" className="arrow-icon import-arrow" />
        <button
          className="submit-button backup-submit"
          onClick={handleImportSubmit}
        >
          Import実行
        </button>
        <input
          className="backup-import-input"
          type="file"
          id="import"
          name="import"
          accept=".csv"
        />
      </div>
    </div>
  );
};

export default Backup;
