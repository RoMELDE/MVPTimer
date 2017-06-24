$(function () {
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

    var createWorker = function (minute, tag, icon) {
        tag = tag || "";
        localStorage["lastSelected"] = tag;
        workerCount++;

        var worker = new Worker("js/worker.js");

        writeLog(minute + "min timer started!", tag, workerCount);
        worker.postMessage({ add: minute, id: workerCount });
        worker.onmessage = function (evt) {
            if (Notification && Notification.permission === "granted" && evt.data.notification) {
                Push.create("【" + tag + padLeft(evt.data.id) + "】" + evt.data.message, {
                    icon: icon,
                    tag: evt.data.id,
                    requireInteraction: true
                });
            }
            writeLog(evt.data.message, tag, evt.data.id);
            if (evt.data.terminate) {
                worker.terminate();
            }
        };

        worker.onerror = function (evt) {
            console.log(evt);
        };
    }

    var initControl = function (data) {
        $.each(data, function (i, o) {
            var $div = $('<div>').addClass("monster");
            var $mark = $('<div>').addClass("monster-mark");
            if (o.Type == "MINI") {
                $mark.addClass("monster-mini");
            }
            else {
                $mark.addClass("monster-mvp");
            }
            $div.append($mark);
            $div.css("background-image", "url('img/Face/" + o.Icon + ".png')");
            $div.data('data', o);
            $div.click(function () {
                var current = $(this).data('data');
                $('#TimerTag').val(current.NameZh);
                if (current.Type == "MINI") {
                    createWorker(30, current.NameZh, "img/Face/" + current.Icon + ".png");
                }
                else {
                    createWorker(120, current.NameZh, "img/Face/" + current.Icon + ".png");
                }
            });
            $('#timerList').append($div);
        });

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
        $('#testNotification').click(function () {
            Push.create("【test】test", {
                icon: "img/Face/Smokie.png",
                tag: "test",
                requireInteraction: true
            });
        })
    };

    var init = function () {
        //init Notification
        if (Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
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

        if (localStorage["lastSelected"]) {
            $('#TimerTag').val(localStorage["lastSelected"]);
        }

        var getMonster = function () {
            $.get("data/Table_Monster.json").done(function (d) {
                localStorage["monster"] = JSON.stringify(d);
                localStorage["lastUpdate"] = JSON.stringify(new Date());
                initControl(d);
            });
        }
        if (!localStorage["monster"]) {
            getMonster();
        }
        else {
            $.get("data/lastUpdate.json").done(function (d) {
                if (localStorage["lastUpdate"] && JSON.parse(localStorage["lastUpdate"]) > d) {
                    initControl(JSON.parse(localStorage["monster"]));
                }
                else {
                    getMonster();
                }
            });
        }

    }();
});