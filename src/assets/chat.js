var connection = new signalR.HubConnectionBuilder()
    .withUrl("http://api.taha.sch.ir/chatHub")
    .build();

connection.start().then(function () {
    alert("start")
}).catch(function (err) {
    return console.error(err.toString());
});