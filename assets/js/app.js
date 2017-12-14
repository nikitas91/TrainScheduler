
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAfREUsdLVvhGMpi7V7EHn8urz1VxTEd7w",
    authDomain: "trainschedulerproject.firebaseapp.com",
    databaseURL: "https://trainschedulerproject.firebaseio.com",
    projectId: "trainschedulerproject",
    storageBucket: "trainschedulerproject.appspot.com",
    messagingSenderId: "340145154188"
};
firebase.initializeApp(config);
var database = firebase.database();

//  Global variables
var datePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

$("#submit").on("click", function () {
    event.preventDefault();

    if (validateForm()) {
        var tName = $("#train-name").val().trim();
        var tDest = $("#train-dest").val().trim();
        var tTime = $("#train-time").val().trim();
        var tFreq = $("#train-freq").val().trim();
        var tDateTime = moment(tTime, "hh:mm").format("X");

        // database.ref().push({
        //     trainName: tName,
        //     trainDestination: tDest,
        //     trainStartTime: tDateTime,
        //     trainFrequency: tFreq
        // });

        $("#train-name").val("");
        $("#train-dest").val("");
        $("#train-time").val("");
        $("#train-freq").val("");
        $("#train-name").focus();
    }
});

$("#refresh-train-data").on("click", function(){
    $("#train-schedule-table tbody tr").each(function(){
        var td_FreqCell = $(this).find("td").eq(2);
        var td_NextArrivalCell = $(this).find("td").eq(3);
        var td_MinAwayCell = $(this).find("td").eq(4);
        var freqValue = parseInt(td_FreqCell.text());
        var nextArrivalValue = moment(td_NextArrivalCell.text(), "hh:mm A");
        var minAwayValue = parseInt(td_MinAwayCell.text());

        var newTimeDiffMinutes = moment().diff(nextArrivalValue, "minutes", true);
        if(newTimeDiffMinutes >= 0){
            var newArrivalTime = nextArrivalValue.add(freqValue, "minutes");
            td_NextArrivalCell.text(newArrivalTime.format("h:mm A"));
            td_MinAwayCell.text(freqValue);
        }
        else if(newTimeDiffMinutes < 0){
            td_MinAwayCell.text(Math.ceil(Math.abs(newTimeDiffMinutes)));
        }
    });
});

database.ref().on("child_added", function (childSnapShot) {
    var currentDate = moment();
    var currentTrainStartTime = moment.unix(childSnapShot.val().trainStartTime);
    var frequencyOfArrival = parseInt(childSnapShot.val().trainFrequency);
    var timeDifferenceInMinutes;
    var trainRemainder;
    var minutesToArrival;
    var nextTrainTime;

    timeDifferenceInMinutes = currentDate.diff(currentTrainStartTime, "minutes");

    if (timeDifferenceInMinutes < 0) {
        minutesToArrival = timeDifferenceInMinutes * -1;
        nextTrainTime = currentDate.add(minutesToArrival, "minutes");
    }
    else {
        trainRemainder = timeDifferenceInMinutes % frequencyOfArrival;
        minutesToArrival = frequencyOfArrival - trainRemainder;
        nextTrainTime = currentDate.add(minutesToArrival, "minutes");
    }

    var tr_TrainRecord = $("<tr>");
    var td_TrainName = $("<td>");
    td_TrainName.text(childSnapShot.val().trainName);

    var td_TrainDestination = $("<td>");
    td_TrainDestination.text(childSnapShot.val().trainDestination);

    var td_TrainFrequency = $("<td>");
    td_TrainFrequency.text(frequencyOfArrival);

    var td_NextArrival = $("<td>");
    td_NextArrival.text(nextTrainTime.format("h:mm A"));

    var td_MinutesAway = $("<td>");
    td_MinutesAway.text(minutesToArrival);

    tr_TrainRecord.append(td_TrainName);
    tr_TrainRecord.append(td_TrainDestination);
    tr_TrainRecord.append(td_TrainFrequency);
    tr_TrainRecord.append(td_NextArrival);
    tr_TrainRecord.append(td_MinutesAway);

    $("#train-schedule-table tbody").append(tr_TrainRecord);
});

$(document).ready(function () {
    $("#train-name").on("input", function () {
        var train_input = $(this);
        if (train_input.val()) {
            train_input.parent().removeClass("has-error");
        }
        else {
            train_input.parent().addClass("has-error");
        }
    });

    $("#train-dest").on("input", function () {
        var train_dest = $(this);
        if (train_dest.val()) {
            train_dest.parent().removeClass("has-error");
        }
        else {
            train_dest.parent().addClass("has-error");
        }
    });

    $("#train-time").on("input", function () {
        var train_time = $(this);
        if(train_time.val() && datePattern.test(train_time.val())){
            train_time.parent().removeClass("has-error");
        }
        else{
            train_time.parent().addClass("has-error");
        }
    });

    $("#train-freq").on("input", function () {
        var train_freq = $(this);
        if(train_freq.val() && !isNaN(parseInt(train_freq.val()))){
            train_freq.parent().removeClass("has-error");
        }
        else{
            train_freq.parent().addClass("has-error");
        }
    });
});

function validateForm() {
    var validated = true;

    $(".form-group").removeClass("has-error");

    if ($("#train-name").val() === "") {
        $("#train-name").parent().addClass("has-error");
        validated = false;
    }
    if ($("#train-dest").val() === "") {
        $("#train-dest").parent().addClass("has-error");
        validated = false;
    }
    if ($("#train-time").val() === "" && !datePattern.test($("#train-time").val().trim())) {
        $("#train-time").parent().addClass("has-error");
        validated = false;
    }
    if ($("#train-freq").val() === "" && isNaN(parseInt($("#train-freq").val()))) {
        $("#train-freq").parent().addClass("has-error");
        validated = false;
    }
    return validated;
}