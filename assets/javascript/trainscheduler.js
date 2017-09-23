
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCPbPxdYa-ePO2ylSvsNtTpWd0qLT_etc",
    authDomain: "trainschedule-8bfa2.firebaseapp.com",
    databaseURL: "https://trainschedule-8bfa2.firebaseio.com",
    projectId: "trainschedule-8bfa2",
    storageBucket: "trainschedule-8bfa2.appspot.com",
    messagingSenderId: "470982054323"
  };
  firebase.initializeApp(config);


// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

var trainsRef = database.ref('/trains');

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.


$(document).ready(function(){
  displayTrains();
  var intervalId = setInterval(function(){
    $('#tbody').empty()
    displayTrains();
  },60000);
})


// Whenever a user clicks the Submit button
$("#add-train").on("click", function(event) {
    // Prevent form from submitting
   event.preventDefault();

    // If any errors are experienced, log them to console.
    var tName = $("#trainName").val().trim();
    var tDestination = $("#trainDestination").val().trim();
    var tFrequency = $("#trainFrequency").val().trim();
    var tFirstTime = $("#trainFirstTime").val().trim();


    var timeToTrain = 10;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tFirstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();


   // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var tNextArrival = moment().add(tMinutesTillTrain, "minutes");

    // Creates local "temporary" object for holding Train data
    var newTrain = {
      name: tName,
      destination: tDestination,
      frequency: tFrequency,
      trainFirstTime: tFirstTime

    };

    // Uploads New Train data to the database
    trainsRef.push(newTrain);
    // Clears all of the text-boxes
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFrequency").val("");
    $("#trainFirstTime").val("");

});
function displayTrains(){
  database.ref('/trains').on("child_added", function(snapshot) { 
    var tName = snapshot.val().name;
    var tDestination = snapshot.val().destination;
    var tFrequency = snapshot.val().frequency;
    var tFirstTime = snapshot.val().trainFirstTime;
    //var timeToTrain = 10;
    //var nextTrainTime = 10 ;

    var timeToTrain = 10;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tFirstTime, "hh:mm A").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var tNextArrival = moment(moment().add(tMinutesTillTrain, "minutes")).format("hh:mm A");

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
    tFrequency + "</td><td>" + tNextArrival + "</td><td>" + tMinutesTillTrain + "</td></td><td>" + '<button id="update">Update</button>' + "</td></td>" + "</td><td>" + '<button id="remove">Remove</button>' + "</td></tr>");
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
}
var keys = [];
// Whenever a user clicks the Submit button
$(document).on("click", "#remove", function(event) {
    // Prevent form from submitting
    event.preventDefault();
   
    var rowindex = $(this).closest('tr').index();
    console.log('Index', rowindex);
    

    trainsRef.on("value", function(snapshot) {
      console.log(snapshot.numChildren())
      console.log(snapshot.child(1))
      snapshot.forEach(function(data) {
        console.log("The key is " + data.key );
        keys.push(data.key)
      });
      for (i=0;i<snapshot.numChildren();i++){
        if (rowindex=== i){
          console.log('key to be removed' + keys[i])
          tRemoveKey = keys[i];
          trainsRef.child(keys[i]).remove();
          $('#tbody').empty()  
          displayTrains();
        }
      }

      
      
    });
  

});