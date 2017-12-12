
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
    var tDateTime = moment(tTime, "hh:mm").format("M/D/YYYY, hh:mm A");
    console.log("Train Name: " + tName);
    console.log("Train Destination: " + tDest);
    console.log("Train Time: " + tTime);
    console.log("Train Frequency: " + tFreq);
    console.log("Train Start Date and Time: " + tDateTime);

    // database.ref().push({
    //     trainName: tName,
    //     trainDestination: tDest,
    //     trainTime: tTime,
    //     trainFrequency: tFreq
    // });
});

database.ref().on("child_added", function(childSnapShot){
    var tr_TrainRecord = $("<tr>");

    var td_TrainName = $("<td>");
    td_TrainName.text(childSnapShot.val().trainName);

    var td_TrainDestination = $("<td>");
    td_TrainDestination.text(childSnapShot.val().trainDestination);

    var td_TrainFrequency = $("<td>");
    td_TrainFrequency.text(childSnapShot.val().trainFrequency);

    //  Use this to calculate next arrival time and minutes away
    //  childSnapShot.val().trainTime
    var td_NextArrival = $("<td>");
    td_TrainTime.text("-");

    var td_MinutesAway = $("<td>");
    td_MinutesAway.text("-");

    tr_TrainRecord.append(td_TrainName);
    tr_TrainRecord.append(td_TrainDestination);
    tr_TrainRecord.append(td_TrainFrequency);
    tr_TrainRecord.append(td_NextArrival);
    tr_TrainRecord.append(td_MinutesAway);

    $("#train-schedule-table tbody").append(tr_TrainRecord);
});