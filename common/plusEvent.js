const plusEvent = (fn) => {
    if (window.plus) {
        setTimeout(fn, 0);
    } else {
        document.addEventListener("plusready", fn, false);
    }
};
export default plusEvent;
