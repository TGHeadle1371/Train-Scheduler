// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the train time.
// 5. Calculate minutes away

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
var getKey = "";

// Add Employee Button
$("#addTrain").on("click", function(event) {
    // prevent page reload
    event.preventDefault();

    // Grabbed values from text boxes
    var name = $("#name-input")
        .val()
        .trim();
    var dest = $("#destination-input")
        .val()
        .trim();
    var startTime = moment(
        $("#firstTrainTime-input")
            .val()
            .trim(),
        "HH:mm"
    ).format("X");
    var freq = $("#frequency-input")
        .val()
        .trim();

    // Local temporary object for data
    var newTrain = {
        name: name,
        dest: dest,
        startTime: startTime,
        freq: freq
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
database.ref().on(
    "child_added",
    function(snapshot) {
        // Store in variables
        var newTrain = snapshot.val().name;
        var newDest = snapshot.val().dest;
        var newTime = snapshot.val().startTime;
        var newFreq = snapshot.val().freq;

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
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(
            1,
            "years"
        );
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
        var nextTrain = moment()
            .add(tMinutesTillTrain, "minutes")
            .format("HH:mm");
        console.log("ARRIVAL TIME: " + nextTrain);

        // Create new row
        var newRow = $("<tr id=" + "'" + snapshot.val() + "'" + ">").append(
            $("<td>").text(newTrain),
            $("<td>").text(newDest),
            $("<td>").text(newFreq),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
            "<td class='col-xs-1'>" +
                "<input type='submit' value='Remove train' class='remove-train btn btn-secondary btn-sm'>" +
                "</td>" +
                "</tr>"
        );
        newRow
            .attr("data-snapKey", snapshot)
            .attr("title", "Delete Saved Search");

        // Append the new row to the table
        $("#trains > tbody").append(newRow);

        // Trying to add Remove button
        $(".remove-train").on("click", function() {
            $(this)
                .closest("tr")
                .remove();
            getKey = $(this)
                .parent()
                .parent()
                .attr("id");
            database.ref($(this).attr("data-snapKey")).remove();
        });

        // Create individual IDs for trains
        var index = 0;
        $("#trains > tbody > tr").each(function() {
            $(this).attr("id", index++);
        });
    },

    // Handle the errors
    // Run error function if it doesnt work
    function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }
);
