export const getLastWeekDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
  };
  export const getLastMonthDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  };
  export const getLast90DaysDate = (date) => {
    return new Date(date.getFullYear()-1, date.getMonth() - 3, date.getDate());
  };
  export const getTodayDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  export const getCurrentYear=(date)=>{
    return new Date(date.getFullYear(), 0, 1);
  }
  export const formatDate = (date) => {
    return `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
};