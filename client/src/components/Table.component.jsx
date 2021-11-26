import React from "react";
import "./Table.style.css";

const Table = ({ data, seq, handleTable, handleUrl, title }) => (
  <div className="table-container">
    <table>
      <thead>
        <tr>
          {title.map((item) => (
            <th key={item}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.embryo_id ? row.embryo_id : row.id + row.opu_day}>
            {seq.map((item) => {
              if (item === "Select") {
                return (
                  <td key={item} className="th-select-td">
                    <input
                      className="th-select-input"
                      type="radio"
                      onChange={handleTable}
                      name="embryo_id"
                      value={row.embryo_id}
                    />
                  </td>
                );
              }
              if (item === "選択1") {
                let value = [row.id, row.opu_day];
                return (
                  <td key={item} className="th-select-td">
                    <input
                      className="th-select-input"
                      type="radio"
                      onChange={handleTable}
                      name="idAndOpu_day1"
                      value={value}
                    />
                  </td>
                );
              }
              if (item === "選択2") {
                let value = [row.id, row.opu_day];
                return (
                  <td key={item} className="th-select-td">
                    <input
                      className="th-select-input"
                      type="radio"
                      onChange={handleTable}
                      name="idAndOpu_day2"
                      value={value}
                    />
                  </td>
                );
              }
              if (item === "Url") {
                return (
                  <td key={item} className="th-button-td">
                    {row.url && (
                      <button
                        onClick={() =>
                          handleUrl(row.id, row.name, row.embryo_id, row.url)
                        }
                      >
                        見る
                      </button>
                    )}
                  </td>
                );
              }
              let cellData = row[item.toLowerCase()];
              cellData =
                typeof cellData === "string" && cellData.includes("-")
                  ? cellData.replaceAll("-", "/")
                  : cellData;
              return <td key={item}>{cellData}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
