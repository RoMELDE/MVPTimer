$(function () {
    var init = function () {
        if (localStorage["lastSelected"]) {
            $('#TimerTag').val(localStorage["lastSelected"]);
        }
    }();

    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        });
    }

    var writeLog = function (text, tag, id) {
        text = "【" + tag + padLeft(id) + "】" + text + "\t" + new Date().toISOString();
        $('#log').text(text + (text.length > 0 ? "\r\n" : "") + $('#log').text());
    }

    var workerCount = 0;
    var padLeft = function (num) {
        var str = "" + num;
        var pad = "000"
        return pad.substring(0, pad.length - str.length) + str;
    }

    var createWorker = function (minute, tag) {
        tag = tag || "";
        localStorage["lastSelected"] = tag;
        workerCount++;

        var worker = new Worker("js/worker.js");

        writeLog(minute + "min timer started!", tag, workerCount);
        worker.postMessage({ add: minute, id: workerCount });
        worker.onmessage = function (evt) {
            if (Notification && Notification.permission === "granted" && evt.data.notification) {
                var notification = new Notification("【" + tag + padLeft(evt.data.id) + "】" + evt.data.message, { tag: evt.data.id, requireInteraction: true });
            }
            writeLog(evt.data.message, tag, evt.data.id);
            if (evt.data.terminate) {
                worker.terminate();
                writeLog(evt.data.message, tag, evt.data.id);
            }
        };

        worker.onerror = function (evt) {
            console.log(evt);
        };
    }

    $('#addTimer30').click(function () {
        var tag = $('#TimerTag').val();
        createWorker(30, tag);
    })
    $('#addTimer120').click(function () {
        var tag = $('#TimerTag').val();
        createWorker(120, tag);
    })
    $('#addTimerCustom').click(function () {
        var tag = $('#TimerTag').val();
        createWorker(parseInt($('#addTimerCustomMinute').val() || 1), tag);
    })

    setInterval(function () {
        if (!Notification) {
            alert("浏览器不支持HTML5通知！");
        }
        else {
            if (Notification.permission !== "granted") {
                $('#NotificationDeniedText').show();
            }
            else {
                $('#NotificationDeniedText').hide();
            }
        }
    }, 500);
});