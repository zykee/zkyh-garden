export default new class {
timestampToDate(timestamp:number) {
    var date = new Date(timestamp),
    Y = date.getFullYear(),
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
    D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
    hour = (date.getHours() <10 ? '0' + (date.getHours()) :date.getHours()),
    minute = (date.getMinutes() <10 ? '0' + (date.getMinutes()) :date.getMinutes()),
    second = (date.getSeconds() <10 ? '0' + (date.getSeconds()) :date.getSeconds())
    // alert(Y+M+D);
    return (`${Y}-${M}-${D}  ${hour}:${minute}:${second}`)
  }
}();

