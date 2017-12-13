
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

$("#submit").on("click", function(){
    event.preventDefault();

    var tName = $("#train-name").val().trim();
    var tDest = $("#train-dest").val().trim();
    var tTime = $("#train-time").val().trim();
    var tFreq = $("#train-freq").val().trim();
    var tDateTime = moment(tTime, "hh:mm").format("X");

    database.ref().push({
        trainName: tName,
        trainDestination: tDest,
        trainStartTime: tDateTime,
        trainFrequency: tFreq
    });

    $("#train-name").val("");
    $("#train-dest").val("");
    $("#train-time").val("");
    $("#train-freq").val("");
    $("#train-name").focus();
});

database.ref().on("child_added", function(childSnapShot){

    //  Local variables
    //var currentDate = moment("2017-12-13 02:05:00");
    var currentDate = moment();
    var currentTrainStartTime = moment.unix(childSnapShot.val().trainStartTime);

    console.log("--------------------------------------------------");
    console.log("Train: " + childSnapShot.val().trainName)
    console.log("Current Date: " + currentDate.format("MM/DD/YYYY, hh:mm A"));
    console.log("Train Start Time: " + currentTrainStartTime.format("MM/DD/YYYY, hh:mm A"));
    console.log("--------------------------------------------------");

    var frequencyOfArrival = parseInt(childSnapShot.val().trainFrequency);
    var timeDifferenceInMinutes;
    var trainRemainder;
    var minutesToArrival;
    var nextTrainTime;

    timeDifferenceInMinutes = currentDate.diff(currentTrainStartTime, "minutes");

    if(timeDifferenceInMinutes < 0){
        minutesToArrival = timeDifferenceInMinutes * -1;
        nextTrainTime = currentDate.add(minutesToArrival, "minutes");
    }
    else{
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
    td_NextArrival.text(nextTrainTime.format("M/DD/YYYY, hh:mm A"));

    var td_MinutesAway = $("<td>");
    td_MinutesAway.text(minutesToArrival);

    tr_TrainRecord.append(td_TrainName);
    tr_TrainRecord.append(td_TrainDestination);
    tr_TrainRecord.append(td_TrainFrequency);
    tr_TrainRecord.append(td_NextArrival);
    tr_TrainRecord.append(td_MinutesAway);

    $("#train-schedule-table tbody").append(tr_TrainRecord);
});