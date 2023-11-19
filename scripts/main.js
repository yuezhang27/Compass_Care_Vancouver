const mapViewButton = document.getElementById('map-view-fab');
let isMapView = true;

mapViewButton.addEventListener('click', function () {
    if (isMapView) {
        // Switch to List View
        mapViewButton.textContent = 'List View';
        // Add code to switch to the list view here
        // 1. url to main.html
        // 2. icon to "List"
    } else {
        // Switch to Map View
        mapViewButton.textContent = 'Map View';
        // Add code to switch to the map view here
        // 1. url to map.html
        // 2. icon to "Map"
    }
    isMapView = !isMapView;
});





// ---------------------------------------------------
// Data in Firebase
// commented out becasue it keeps printing more entires in database
// function writeResources() {
//     //define a variable for the collection you want to create in Firestore to populate data
//     var resourcesRef = db.collection("resources");

//     resourcesRef.add({
//         code: "foodbank1",
//         name: "Greater Vancouver Food Bank",
//         category: "food",
//         city: "Vancouver",
//         province: "BC",
//         description: "A non-profit organization committed to addressing food insecurity in the community. Through various distribution centers, they provide nutritious food to individuals and families in need, fostering a collaborative approach with local partners to maximize their impact on hunger relief.",
//         location: "8345 Winston Street Burnaby, BC V5A 2H3",
//         contactPhone: "(604) 876-3601",
//         last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
//     });
//     resourcesRef.add({
//         code: "foodbank2",
//         name: "Richmond Food Bank Society", 
//         category: "food",
//         city: "Vancouver",
//         province: "BC",
//         description: "A non-profit organization committed to eradicating hunger in the Richmond community. They operate distribution centers, offering essential food assistance to individuals and families while collaborating with local partners to create a comprehensive solution to food insecurity.",
//         location: "5800 Cedarbridge Way #100, Richmond, BC V6X 2A7",
//         contactPhone: "(604) 271-5609",
//         last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
//     });
// resourcesRef.add({
//     code: "NV01",
//     name: "North Vancouver Food Bank", //replace with your own city?
//     city: "North Vancouver",
//     province: "BC",
// 	description: "Each month we provide healthy food to around 16,000 individuals and families in need and 138 Community Agency Partners across Vancouver, Burnaby, New Westminster, and the North Shore. Our mission is to provide healthy food to those in need.",
//     last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
// });
// }



// Time Stamp to xx h: xx min : xx s
function formatTimestamp(timestamp) {
    const fullTimestamp = timestamp.seconds + timestamp.nanoseconds / 1e9;
    const date = new Date(fullTimestamp * 1000);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

// display the cards we can read
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection, category) {
    let cardTemplate = document.getElementById("resultTemplate"); // Retrieve the HTML element with the ID "resultTemplate" and store it in the cardTemplate variable. 
    let gallery = document.getElementById(collection + "-go-here");

    // Clear existing content
    gallery.innerHTML = "";

    let query = db.collection(collection)

    if (category !== null) {
        query = query.where("category", "==", category)
    }
    query.get()   //the collection called "hikes"
        .then(allResources => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allResources.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "description" key
                var updateTime = doc.data().last_updated;
                realTime = formatTimestamp(updateTime);
                var resourceCode = doc.data().code;    //get ID to each resource to be used for fetching right image
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.text-muted').innerHTML = "Last update: " + realTime;
                newcard.querySelector('.description').innerHTML = description;
                newcard.querySelector('.card-img-bottom').src = `./images/${resourceCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "each_info.html?docID=" + docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                // newcard.querySelector('i').onclick = saveBookmark(docID);
                newcard.querySelector('i').onclick = (event) => saveBookmark(event, docID);


                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //function to send each card to an info page when div is clicked
                // const maincard = document.querySelectorAll(".maincard");

                // maincard.forEach(function(div) {
                //     div.addEventListener('click', function () {

                //         console.log("card has been clicked");
                //         window.location.href = "each_info.html?docID=" +docID;  
                //     }); 
                // });


                //i++;   //Optional: iterate variable to serve as unique ID
            })

        })
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
// //-----------------------------------------------------------------------------
// function saveBookmark(event, resourceDocID) {
//     console.log("call save bookmark")
//     // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
// currentUser.update({
//                     // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
//             // This method ensures that the ID is added only if it's not already present, preventing duplicates.
//         bookmarks: firebase.firestore.FieldValue.arrayUnion(resourceDocID)
//     })
//             // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
//     .then(function () {
//         console.log("bookmark has been saved for" + resourceDocID);
//         var iconID = 'save-' + resourceDocID;
//         //console.log(iconID);
//                     //this is to change the icon of the hike that was saved to "filled"
//         document.getElementById(iconID).innerText = 'bookmark';
//     });
// }

function saveBookmark(event, resourceDocID) {
    currentUser.get().then((doc) => {
        var userData = doc.data();
        var bookmarks = userData.bookmarks || [];
        if (bookmarks.includes(resourceDocID)) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(resourceDocID)
            })
            .then(function () {
                console.log("Bookmark removed for " + resourceDocID);
                updateBookmarkIcon(resourceDocID, false);
            });
        } else {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(resourceDocID)
            })
            .then(function () {
                console.log("Bookmark added for " + resourceDocID);
                updateBookmarkIcon(resourceDocID, true);
            });
        }
    });
}

function updateBookmarkIcon(resourceDocID, isBookmarked) {
    var iconID = 'save-' + resourceDocID;
    var icon = document.getElementById(iconID);
    if (icon) {
        icon.innerText = isBookmarked ? 'bookmark' : 'bookmark_border';
    }
}

function removeActiveStyles() {
    document.querySelectorAll('.filterbtn').forEach(button => {
        button.classList.remove('active_filter');
    });
}


displayCardsDynamically("resources",null)  //input param is the name of the collection
let isFoodActive = false;

// add clicked function on food filter button

function toggleFood() {
    removeActiveStyles();
    const button = document.getElementById('FoodBtn');

    // Toggle the state
    isFoodActive = !isFoodActive;

    if (isFoodActive) {
        // Execute the function when the button is active
        displayCardsDynamically("resources", "food")
        button.classList.add('active_filter'); // Apply active styling
    } else {
        // Execute another function or no function when the button is not active
        displayCardsDynamically("resources", null)
    }
}

// add clicked function on money filter button
let isMoneyActive = false;

function toggleMoney() {
    removeActiveStyles()
    const button = document.getElementById('MoneyBtn');

    // Toggle the state
    isMoneyActive = !isMoneyActive;

    if (isMoneyActive) {
        // Execute the function when the button is active
        displayCardsDynamically("resources", "money")
        button.classList.add('active_filter'); // Apply active styling
    } else {
        // Execute another function or no function when the button is not active
        displayCardsDynamically("resources", null)
    }
}

// add clicked function on housing filter button
let isHousingActive = false;

function toggleHousing() {
    removeActiveStyles()
    const button = document.getElementById('HousingBtn');

    // Toggle the state
    isHousingActive = !isHousingActive;

    if (isHousingActive) {
        // Execute the function when the button is active
        displayCardsDynamically("resources", "housing")
        button.classList.add('active_filter'); // Apply active styling
    } else {
        // Execute another function or no function when the button is not active
        displayCardsDynamically("resources", null)
    }
}

// add clicked function on work filter button
let isWorkActive = false;

function toggleWork() {
    removeActiveStyles()
    const button = document.getElementById('WorkBtn');

    // Toggle the state
    isWorkActive = !isWorkActive;

    if (isWorkActive) {
        // Execute the function when the button is active
        displayCardsDynamically("resources", "work")
        button.classList.add('active_filter'); // Apply active styling
    } else {
        // Execute another function or no function when the button is not active
        displayCardsDynamically("resources", null)
    }
}

//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            displayCardsDynamically("resources");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

