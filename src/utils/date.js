export function getDateTime() {
  let dt = new Date();
  let year = dt.getFullYear();
  let month = dt.getMonth() + 1;
  let day = dt.getDate();
  let hour = dt.getHours();
  let minute = dt.getMinutes();
  let second = dt.getSeconds();
  let millionSecond = dt.getMilliseconds();
  if (month < 10) {
    month = "0" + month;
  };
  if (day < 10) {
    day = "0" + day;
  };
  if (hour < 10) {
    hour = "0" + hour;
  };
  if (minute < 10) {
    minute = "0" + minute;
  };
  if (second < 10) {
    second = "0" + second;
  };
  let formatDt = year + '-' + month + '-' + day + "  " + hour + ':' + minute + ':' + second + ':' + millionSecond;
  return formatDt;
};

export function getDate() {
  let dt = new Date();
  let year = dt.getFullYear();
  let month = dt.getMonth() + 1;
  let day = dt.getDate();
  if (month < 10) {
    month = "0" + month;
  };
  if (day < 10) {
    day = "0" + day;
  };

  let formatDt = year + '-' + month + '-' + day;
  return formatDt;
};
