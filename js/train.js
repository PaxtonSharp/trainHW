var name = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;
var formattedNextTrain;

var firebaseConfig = {
    apiKey: "AIzaSyBloBN0Ake0jLF27zgTzJN7GwHCNDzPQK8",
    authDomain: "project-976c3.firebaseapp.com",
    databaseURL: "https://project-976c3.firebaseio.com",
    projectId: "project-976c3",
    storageBucket: "project-976c3.appspot.com",
    messagingSenderId: "781219279406",
    appId: "1:781219279406:web:355eb96bf82c2051f0a5bf",
    measurementId: "G-FZJYG4R67V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

// load data even if page reloaded
database.ref().on("child_added", function(childSnapshot) {
    // fetch stored data
    name = childSnapshot.val().name;
    destination = childSnapshot.val().destination;
    firstTrainTime = childSnapshot.val().firstTrain;
    frequency = childSnapshot.val().frequency;
    // recalculate time
    timeCalc();

    // create carousel for stored data
    printContent();
});

// on submit form click run -->
$(".submitForm").click(function() {
    event.preventDefault();
    name = $("#trainName")
        .val()
        .trim();

    destination = $("#userDestination")
        .val()
        .trim();

    firstTrainTime = $("#trainTime")
        .val()
        .trim();

    frequency = $("#trainFrequency")
        .val()
        .trim();

    // run time calc
    timeCalc();

    // save form data to firebase
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrainTime,
        frequency: frequency
            // nexttrain: formattedNextTrain
    });

    // clear input fields after submit
    $(this)
        .closest("form")
        .find("input[type=text], textarea")
        .val("");

    printContent();
});

// function to create new carousel item
function printContent() {
    var holderDiv = $("<div class='carousel-item'>");
    var innerDiv = $("<div class='d-block w-100 timeBox text-center'>");

    // creating new carousel with form data
    var holder = innerDiv.html(
        "<h3 class='carouselName'>" +
        name +
        "</h3>" +
        "<div class='trainInfo'> Destination: " +
        destination +
        "</div>" +
        "<div class='trainInfo'> First Train Time: " +
        firstTrainTime +
        "</div>" +
        "<div class='trainInfo'> Frequency: " +
        frequency + " mins" +
        "</div>" +
        "<div class='trainInfo'> Next Train: " +
        formattedNextTrain +
        "</div>"
    );

    var wrapper = holderDiv.append(holder);

    // append to existing carousel
    $(".appendHere").append(wrapper);
}

function timeCalc() {
    // make sure time is before current time
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    // get current time
    var currentTime = moment();
    // check difference between times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // check remainder
    var remainder = diffTime % frequency;
    // minutes till train
    var minutesTillTrain = frequency - remainder;
    // calculated time of next train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    // display in numbers
    formattedNextTrain = moment(nextTrain).format("hh:mm");
    console.log(formattedNextTrain);
}