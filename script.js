// Function to open the image in full screen
function openFullscreenImage(src) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    const img = document.createElement('img');
    img.src = src;
    img.className = 'fullscreen-image';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerText = 'Close';
    
    closeButton.onclick = function() {
        document.body.removeChild(overlay); // Remove the overlay when closed
    };

    overlay.appendChild(img);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
    overlay.style.display = 'flex'; // Show the overlay
}

// Add click event listeners to images
document.querySelectorAll('.accuracy-image').forEach(image => {
    image.onclick = function() {
        openFullscreenImage(this.src); // Pass the image source to the function
    };
});

function openPopup(model) {
    document.getElementById('popup-title').innerText = model;
    const inputFieldsContainer = document.getElementById('input-fields');
    inputFieldsContainer.innerHTML = ''; // Clear previous input fields

    // Define input fields based on the selected model
    let inputFields = '';
    switch (model) {
        case 'Employee Attrition':
            inputFields = `
                <input type="number" class="input-field" placeholder="Employee Satisfaction" id="employeeSatisfaction" required />
                <input type="number" class="input-field" placeholder="Salary" id="salary" required />
                <input type="number" class="input-field" placeholder="Overtime (0 or 1)" id="overtime" required />
                <input type="number" class="input-field" placeholder="Distance from Home" id="distanceFromHome" required />
            `;
            break;
        case 'Plant Health Predictor':
            inputFields = `
                <input type="text" class="input-field" placeholder="Green Color (0-255)" id="greenColor" required />
                <input type="number" class="input-field" placeholder="Sun Exposure (hours)" id="sunExposure" required />
                <input type="number" class="input-field" placeholder="Plant Height (cm)" id="plantHeight" required />
                <input type="number" class="input-field" placeholder="Plant Age (years)" id="plantAge" required />
            `;
            break;
        case 'Sleep Health Predictor':
            inputFields = `
                <input type="text" class="input-field" placeholder="Gender" id="gender" required />
                <input type="text" class="input-field" placeholder="Sleep Disorder" id="sleepDisorder" required />
                <input type="number" class="input-field" placeholder="Age" id="age" required />
                <input type="number" class="input-field" placeholder="Sleep Time (hours)" id="sleepTime" required />
            `;
            break;
        case 'Placement Chances':
            inputFields = `
                <input type="number" class="input-field" placeholder="CGPA" id="cgpa" required />
            `;
            break;
        case 'Shopping Frequency Predictor':
            inputFields = `
                <input type="text" class="input-field" placeholder="Gender" id="genderShopping" required />
                <input type="number" class="input-field" placeholder="Age" id="ageShopping" required />
                <input type="text" class="input-field" placeholder="Loyalty Status" id="loyaltyStatus" required />
                <input type="number" class="input-field" placeholder="Purchase Amount" id="purchaseAmount" required />
            `;
            break;
        default:
            console.error('Invalid model ID');
            return;
    }

    inputFieldsContainer.innerHTML = inputFields;
    document.getElementById('popup').style.display = 'flex'; // Show the popup
}

function closePopup() {
    document.getElementById('popup').style.display = 'none'; // Hide the popup
    document.getElementById('prediction-result').textContent = ''; // Clear the prediction result
}

// Replace these with your actual API keys
const API_KEY = "cpd-apikey-IBMid-692000GWQZ-2024-08-03T13:12:44Z"; // Replace with your actual API key

const MODEL_DEPLOYMENT_IDS = {
    employeeAttrition: "407d1a59-54fa-4336-a301-795e6fc87541", // Replace with actual ID
    plantHealth: "21cf652c-aab6-4f41-a94c-827ebd027bbc", // Replace with actual ID
    sleepHealth: "e8bccdf0-6318-46a0-add1-9cf4b75766be", // Replace with actual ID
    placementChances: "d6e4e204-4db0-4bff-b518-a294f93231a1", // Replace with actual ID
    shoppingFrequency: "793ebf9e-2863-463b-a605-bfafd11a0cbc" // Replace with actual ID
};

function getToken(errorCallback, loadCallback) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", loadCallback);
    req.addEventListener("error", errorCallback);
    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/json");
    req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", "Bearer " + token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
}

function predict() {
    const modelId = document.getElementById('popup-title').innerText.toLowerCase().replace(/ /g, ''); // Normalize model ID
    const inputData = {};

    // Collect input values based on the model
    switch (modelId) {
        case 'employeeattrition':
            inputData.employeeSatisfaction = document.getElementById('employeeSatisfaction').value;
            inputData.salary = document.getElementById('salary').value;
            inputData.overtime = document.getElementById('overtime').value;
            inputData.distanceFromHome = document.getElementById('distanceFromHome').value;
            break;
        case 'planthealthpredictor':
            inputData.greenColor = document.getElementById('greenColor').value;
            inputData.sunExposure = document.getElementById('sunExposure').value;
            inputData.plantHeight = document.getElementById('plantHeight').value;
            inputData.plantAge = document.getElementById('plantAge').value;
            break;
        case 'sleephealthpredictor':
            inputData.gender = document.getElementById('gender').value;
            inputData.sleepDisorder = document.getElementById('sleepDisorder').value;
            inputData.age = document.getElementById('age').value;
            inputData.sleepTime = document.getElementById('sleepTime').value;
            break;
        case 'placementchances':
            inputData.cgpa = document.getElementById('cgpa').value;
            break;
        case 'shoppingfrequencypredictor':
            inputData.gender = document.getElementById('genderShopping').value;
            inputData.age = document.getElementById('ageShopping').value;
            inputData.loyaltyStatus = document.getElementById('loyaltyStatus').value;
            inputData.purchaseAmount = document.getElementById('purchaseAmount').value;
            break;
        default:
            console.error('Invalid model ID');
            return;
    }

    getToken((err) => console.log(err), function () {
        let tokenResponse;
        try {
            tokenResponse = JSON.parse(this.responseText);
        } catch (ex) {
            console.error('Error parsing token response:', ex);
            return;
        }

        const scoring_url = `https://private.us-south.ml.cloud.ibm.com/ml/v4/deployments/${MODEL_DEPLOYMENT_IDS[modelId]}/predictions?version=2021-05-01`; // Use the correct deployment ID
        const payload = JSON.stringify({
            input_data: [{
                fields: Object.keys(inputData),
                values: [Object.values(inputData)]
            }]
        });

        apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
            let parsedPostResponse;
            try {
                parsedPostResponse = JSON.parse(this.responseText);
            } catch (ex) {
                console.error('Error parsing prediction response:', ex);
                return;
            }
            console.log("Scoring response:", parsedPostResponse);
            displayPredictionResult(`Prediction Result: ${parsedPostResponse.predictions[0].values[0][0]}`);
        }, function (error) {
            console.error('Error during API post request:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while fetching the prediction.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
}
 
function handleContactForm(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = event.target[0].value; // Get the name input value
    const email = event.target[1].value; // Get the email input value
    const message = event.target[2].value; // Get the message input value

    // Here you can send the data to your backend service
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

    // Optionally, show a success message
    Swal.fire({
        title: 'Thank you!',
        text: 'Your message has been sent successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Reset the form
    event.target.reset();
}

// Scroll to Top functionality
window.onscroll = function() {
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Anime.js for button animations
document.querySelectorAll('.open-popup').forEach(button => {
    button.addEventListener('mouseenter', () => {
        anime({
            targets: button,
            scale: [1, 1.1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    });

    button.addEventListener('mouseleave', () => {
        anime({
            targets: button,
            scale: [1.1, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    });
});

// Anime.js for model cards entrance
const modelCards = document.querySelectorAll('.model-card');
modelCards.forEach((card, index) => {
    anime({
        targets: card,
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 500,
        delay: index * 100, // Stagger the entrance
        easing: 'easeOutExpo'
    });
});
