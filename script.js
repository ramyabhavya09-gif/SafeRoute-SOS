// Store user's location
let latitude = null;
let longitude = null;


// Get Current Location
function getLocation() {

    const locationText = document.getElementById("location");
    const status = document.getElementById("status");

    if (!navigator.geolocation) {
        locationText.textContent =
            "Location is not supported by your browser.";
        return;
    }

    status.textContent = "Detecting location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            locationText.innerHTML =
                "Latitude: " + latitude +
                "<br>Longitude: " + longitude;

            status.textContent = "Location detected successfully!";
        },

        function () {

            locationText.textContent =
                "Unable to get location. Please allow location access.";

            status.textContent = "Location access failed.";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000
        }
    );
}


// Open Google Maps
function openMap() {

    if (latitude === null || longitude === null) {
        alert("Please detect your location first.");
        return;
    }

    const mapURL =
        "https://www.google.com/maps?q=" +
        latitude + "," + longitude;

    window.open(mapURL, "_blank");
}


// Generate Emergency Message
function generateMessage() {

    const emergencyType =
        document.getElementById("emergencyType").value;

    let message =
        "EMERGENCY ALERT!\n" +
        "Emergency Type: " + emergencyType + "\n" +
        "I need assistance. Please contact me.";

    if (latitude !== null && longitude !== null) {

        const mapURL =
            "https://www.google.com/maps?q=" +
            latitude + "," + longitude;

        message += "\nMy Location: " + mapURL;
    }

    return message;
}


// SOS Button
function activateSOS() {

    const status = document.getElementById("status");

    status.textContent = "Preparing SOS alert...";

    if (latitude === null || longitude === null) {

        getLocation();

        setTimeout(function () {

            shareAlert();

        }, 3000);

    } else {

        shareAlert();
    }
}


// Share Emergency Alert
async function shareAlert() {

    const message = generateMessage();

    if (navigator.share) {

        try {

            await navigator.share({
                title: "Emergency Alert",
                text: message
            });

            document.getElementById("status").textContent =
                "Alert shared successfully.";

        } catch (error) {

            document.getElementById("status").textContent =
                "Alert sharing cancelled.";
        }

    } else {

        copyAlert();
    }
}


// Copy Emergency Message
async function copyAlert() {

    const message = generateMessage();

    try {

        await navigator.clipboard.writeText(message);

        alert("Emergency message copied successfully!");

        document.getElementById("status").textContent =
            "Message copied to clipboard.";

    } catch (error) {

        alert("Unable to copy message.");
    }
}


// Find Nearby Hospitals
function findHospitals() {

    let url;

    if (latitude !== null && longitude !== null) {

        url =
            "https://www.google.com/maps/search/hospitals/@" +
            latitude + "," + longitude + ",15z";

    } else {

        url =
            "https://www.google.com/maps/search/hospitals+near+me";
    }

    window.open(url, "_blank");
}


// Find Nearby Police Stations
function findPolice() {

    let url;

    if (latitude !== null && longitude !== null) {

        url =
            "https://www.google.com/maps/search/police+stations/@" +
            latitude + "," + longitude + ",15z";

    } else {

        url =
            "https://www.google.com/maps/search/police+stations+near+me";
    }

    window.open(url, "_blank");
}


// Save Emergency Contact
function saveContact() {

    const name =
        document.getElementById("contactName").value.trim();

    const number =
        document.getElementById("contactNumber").value.trim();

    if (name === "" || number === "") {

        alert("Please enter contact name and phone number.");
        return;
    }

    const contact = {
        name: name,
        number: number
    };

    localStorage.setItem(
        "emergencyContact",
        JSON.stringify(contact)
    );

    document.getElementById("contactStatus").textContent =
        "Contact saved: " + name;

    alert("Emergency contact saved successfully!");
}


// Prepare SMS
function sendToContact() {

    const savedContact =
        localStorage.getItem("emergencyContact");

    if (!savedContact) {

        alert("Please save an emergency contact first.");
        return;
    }

    const contact = JSON.parse(savedContact);

    const message = generateMessage();

    const smsURL =
        "sms:" + contact.number +
        "?body=" + encodeURIComponent(message);

    window.location.href = smsURL;
}


// Load Saved Contact
window.onload = function () {

    const savedContact =
        localStorage.getItem("emergencyContact");

    if (savedContact) {

        const contact = JSON.parse(savedContact);

        document.getElementById("contactName").value =
            contact.name;

        document.getElementById("contactNumber").value =
            contact.number;

        document.getElementById("contactStatus").textContent =
            "Saved contact: " + contact.name;
    }
};
