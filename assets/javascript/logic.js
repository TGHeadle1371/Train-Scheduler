// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the train time.
// 5. Calculate frequency 

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBIVcQbhPeCiMQc2EHc4B_S9vizlzvpD54",
    authDomain: "trainscheduler-26299.firebaseapp.com",
    databaseURL: "https://trainscheduler-26299.firebaseio.com",
    projectId: "trainscheduler-26299",
    storageBucket: "trainscheduler-26299.appspot.com",
    messagingSenderId: "540066627822"
};
firebase.initializeApp(config);
// Firebase Database
var database = firebase.database();

// Add Employee Button
$("#addTrain").on("click", function (event) {
    event.preventDefault();


    // Grabbed values from text boxes
    var name = $("#name-input").val().trim();
    var dest = $("#destination-input").val().trim();
    var startTime = moment($("#firstTrainTime-input").val().trim(), "HH:mm").format("X");
    var freq = $("#frequency-input").val().trim();

    // Local temporary object for data
    var newTrain = {
        name: name,
        dest: dest,
        startTime: startTime,
        freq: freq,
    };
    // Push data to database
    database.ref().push(newTrain);
    // Console.loging the last user's data
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.startTime);
    console.log(newTrain.freq);

    alert("Train Schedule Successfully Added");

    // Empty the text boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTrainTime-input").val("");
    $("#frequency-input").val("");
});
// Create event for adding Train to the database and a row in the html
database.ref().on("child_added", function (childSnapshot) {
        // Store in variables
        var newTrain = childSnapshot.val().name;
        var newDest = childSnapshot.val().dest;
        var newTime = childSnapshot.val().startTime;
        var newFreq = childSnapshot.val().freq;

        // Employee Information
        console.log(newTrain);
        console.log(newDest);
        console.log(newTime);
        console.log(newFreq);

        // Make the Employee start nice
        var trainStartPretty = moment.unix(newTime).format("HH:mm");

        // Frequency
        var tFrequency = newFreq;

        // New Time
        var firstTime = newTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Create new row
        var newRow = $("<tr>").append(
            $("<td>").text(newTrain),
            $("<td>").text(newDest),
            $("<td>").text(newFreq),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain)
        );
        // Append the new row to the table
        $("#trains > tbody").append(newRow);

        // Create individual IDs for trains
        var index = 0;
        $("#trains > tbody > tr").each(function () {
            $(this).attr("id", index++);
        });
    },

    // Handle the errors
    // Run error function if it doesnt work
    function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });