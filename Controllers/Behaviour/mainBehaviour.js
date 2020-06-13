$("#Minimize").click(() => {
    window.API.send("minimize", {});
});
$("#Maximize").click(() => {
    window.API.send("maximize", {});
});
$("#close").click(() => {
    window.API.send("quit", {});
});