export const getTankCountFromData = (data) => {
  let tankCounts = {
    A: ["A", 0, 0, 0, 0, 0, 0],
    B: ["B", 0, 0, 0, 0, 0, 0],
    C: ["C", 0, 0, 0, 0, 0, 0],
    D: ["D", 0, 0, 0, 0, 0, 0],
    E: ["E", 0, 0, 0, 0, 0, 0],
    F: ["F", 0, 0, 0, 0, 0, 0],
    G: ["G", 0, 0, 0, 0, 0, 0],
    H: ["H", 0, 0, 0, 0, 0, 0],
  };
  for (let i = 0; i < data.length; i++) {
    const { loc, count } = data[i];
    const tank = loc[0];
    const canister = loc[1];
    tankCounts[tank][canister] = Number(count);
  }
  return tankCounts;
};

export const countDetails = (data) => {
  let embryoSum = 0;
  let thawSum = 0;

  data.forEach((row) => {
    embryoSum += row.quantity;
    if (row.thaw_day) {
      thawSum += row.quantity;
    }
  });
  let distance = embryoSum - thawSum;
  return { embryoSum, thawSum, distance };
};

// export const getThawSum = (data) => {
//   let sum = 0;
//   data.forEach((row) => {
//     if (row.thaw_day) {
//       sum += row.quantity;
//     }
//   });
//   return sum;
// };

export const addAgeRows = (data) => {
  data.forEach((row) => {
    row.embryo_age = Math.floor(
      (new Date(row.frozen_day) - new Date(row.birthday)) / 31536000000
    );
  });
  return data;
};

export const createExpireDay = () => {
  const today = new Date().toISOString().slice(0, 10);
  return (Number(today.slice(0, 4)) + 1).toString() + "/" + today.slice(5, 7);
};

export const findAndPlusExpireDayAndExtendTimes = (arr, opuDay) => {
  let newExpireDay = [];
  arr.forEach((obj) => {
    if (obj.opu_day === opuDay) {
      const expire_day = obj.expire_day;
      const plusOneYear = Number(expire_day.slice(0, 4)) + 1;
      const month = expire_day.slice(5);
      newExpireDay[0] = plusOneYear.toString() + "/" + month;
      const extend_times = obj.extend_times;
      newExpireDay[1] = (Number(extend_times) + 1).toString();
    }
  });
  return newExpireDay;
};

export const dataForOtherGraph = (data) => {
  let opu_days = [];
  let embqty_freeze = [];
  let embqty_thaw = [];
  data.forEach((row) => {
    if (!opu_days.includes(row.opu_day)) {
      opu_days.push(row.opu_day);
    }
    const index = opu_days.indexOf(row.opu_day);
    embqty_freeze[index] = embqty_freeze[index] ? embqty_freeze[index] : 0;
    embqty_freeze[index] += row.quantity;
    if (row.thaw_day) {
      embqty_thaw[index] = embqty_thaw[index] ? embqty_thaw[index] : 0;
      embqty_thaw[index] += row.quantity;
    }
  });
  return { opu_days, embqty_freeze, embqty_thaw };
};

const thisYear = new Date().getFullYear();
const pastFiveYears = [
  thisYear - 4,
  thisYear - 3,
  thisYear - 2,
  thisYear - 1,
  thisYear,
];

export const dataForFiveYearGraph = (data) => {
  let eachYearData = [[], [], [], [], []];
  let embqty_freeze = [0, 0, 0, 0, 0];
  let embqty_thaw = [0, 0, 0, 0, 0];
  let id_opu_freeze = [[], [], [], [], []];
  let times_thaw = [0, 0, 0, 0, 0];
  data.forEach((row) => {
    const year = new Date(row.opu_day).getFullYear();
    const index = pastFiveYears.indexOf(year);
    eachYearData[index].push(row);
    embqty_freeze[index] += row.quantity;
    if (!id_opu_freeze[index].includes(row.id + row.opu_day)) {
      id_opu_freeze[index].push(row.id + row.opu_day);
    }
    if (row.thaw_day) {
      embqty_thaw[index] += row.quantity;
      times_thaw[index] += 1;
    }
  });
  const times_freeze = id_opu_freeze.map((item) => item.length);
  return {
    eachYearData,
    embqty_freeze,
    embqty_thaw,
    times_freeze,
    times_thaw,
  };
};

export const dataForOneYearGraph = (data, year) => {
  let embqty_freeze = new Array(12).fill(0);
  let embqty_thaw = new Array(12).fill(0);
  let id_opu_freeze = [[], [], [], [], [], [], [], [], [], [], [], []];
  let times_thaw = new Array(12).fill(0);
  data.forEach((row) => {
    const month = new Date(row.opu_day).getMonth();
    embqty_freeze[month] += row.quantity;
    if (!id_opu_freeze[month].includes(row.id + row.opu_day)) {
      id_opu_freeze[month].push(row.id + row.opu_day);
    }
    if (row.thaw_day) {
      embqty_thaw[month] += row.quantity;
      times_thaw[month] += 1;
    }
  });
  const times_freeze = id_opu_freeze.map((item) => item.length);
  return {
    year,
    embqty_freeze,
    embqty_thaw,
    times_freeze,
    times_thaw,
  };
};
