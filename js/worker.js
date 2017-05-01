// Triggered by postMessage in the page
onmessage = function (evt) {
    var targetDate = new Date();
    targetDate.setMinutes(targetDate.getMinutes() + evt.data.add);
    var isNotAlerted = {
        is0s: true,
        is30s: true,
        is1m: true,
        is3m: true,
        is5m: true,
        is10m: true,
        is20m: true
    };
    var checkDate = function () {
        var current = new Date();
        var current30s = new Date(current);
        current30s.setSeconds(current.getSeconds() + 30);
        var current1 = new Date(current);
        current1.setMinutes(current.getMinutes() + 1);
        var current3 = new Date(current);
        current3.setMinutes(current.getMinutes() + 3);
        var current5 = new Date(current);
        current5.setMinutes(current.getMinutes() + 5);
        var current10 = new Date(current);
        current10.setMinutes(current.getMinutes() + 10);
        var current20 = new Date(current);
        current20.setMinutes(current.getMinutes() + 20);
        if (isNotAlerted.is0s && targetDate <= current) {
            isNotAlerted.is0s = false;
            postMessage({ id: evt.data.id, terminate: true, notification: true, message: "计时结束！" });
        }
        else if (isNotAlerted.is30s && targetDate <= current30s) {
            isNotAlerted.is30s = false;
            postMessage({ id: evt.data.id, terminate: false, notification: true, message: "还剩30秒！" });
        }
        else if (isNotAlerted.is1m && evt.data.add > 1 && targetDate <= current1) {
            isNotAlerted.is1m = false;
            postMessage({ id: evt.data.id, terminate: false, notification: true, message: "还剩1分钟！" });
        }
        else if (isNotAlerted.is3m && evt.data.add > 3 && targetDate <= current3) {
            isNotAlerted.is3m = false;
            postMessage({ id: evt.data.id, terminate: false, notification: true, message: "还剩3分钟！" });
        }
        else if (isNotAlerted.is5m && evt.data.add > 5 && targetDate <= current5) {
            isNotAlerted.is5m = false;
            postMessage({ id: evt.data.id, terminate: false, notification: true, message: "还剩5分钟！" });
        }
        else if (isNotAlerted.is10m && evt.data.add > 10 && targetDate <= current10) {
            isNotAlerted.is10m = false;
            postMessage({ id: evt.data.id, terminate: false, notification: false, message: "还剩10分钟！" });
        }
        else if (isNotAlerted.is20m && evt.data.add > 20 && targetDate <= current20) {
            isNotAlerted.is20m = false;
            postMessage({ id: evt.data.id, terminate: false, notification: false, message: "还剩20分钟！" });
        }
    };
    setInterval(checkDate, 200)
};