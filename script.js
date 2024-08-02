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

// Replace these with your actual API keys
const API_KEYS = {
    employeeAttrition: {
        public: "<your_public_api_key_for_employee_attrition>",
        private: "<your_private_api_key_for_employee_attrition>"
    },
    plantHealth: {
        public: "<your_public_api_key_for_plant_health>",
        private: "<your_private_api_key_for_plant_health>"
    },
    sleepHealth: {
        public: "<your_public_api_key_for_sleep_health>",
        private: "<your_private_api_key_for_sleep_health>"
    },
    placementChances: {
        public: "<your_public_api_key_for_placement_chances>",
        private: "<your_private_api_key_for_placement_chances>"
    },
    shoppingFrequency: {
        public: "<your_public_api_key_for_shopping_frequency>",
        private: "<your_private_api_key_for_shopping_frequency>"
    }
};

function getToken(modelId, errorCallback, loadCallback) {
    const apiKey = API_KEYS[modelId].private; // Use the private API key for token retrieval
    const req = new XMLHttpRequest();
    req.addEventListener("load", loadCallback);
    req.addEventListener("error", errorCallback);
    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/json");
    req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + apiKey);
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
    document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('prediction-result').textContent = ''; // Clear the prediction result
}

function predict() {
    const modelId = document.getElementById('popup-title').innerText;
    const inputData = {};

    // Collect input values based on the model
    switch (modelId) {
        case 'Employee Attrition':
            inputData.employeeSatisfaction = document.getElementById('employeeSatisfaction').value;
            inputData.salary = document.getElementById('salary').value;
            inputData.overtime = document.getElementById('overtime').value;
            inputData.distanceFromHome = document.getElementById('distanceFromHome').value;
            break;
        case 'Plant Health Predictor':
            inputData.greenColor = document.getElementById('greenColor').value;
            inputData.sunExposure = document.getElementById('sunExposure').value;
            inputData.plantHeight = document.getElementById('plantHeight').value;
            inputData.plantAge = document.getElementById('plantAge').value;
            break;
        case 'Sleep Health Predictor':
            inputData.gender = document.getElementById('gender').value;
            inputData.sleepDisorder = document.getElementById('sleepDisorder').value;
            inputData.age = document.getElementById('age').value;
            inputData.sleepTime = document.getElementById('sleepTime').value;
            break;
        case 'Placement Chances':
            inputData.cgpa = document.getElementById('cgpa').value;
            break;
        case 'Shopping Frequency Predictor':
            inputData.gender = document.getElementById('genderShopping').value;
            inputData.age = document.getElementById('ageShopping').value;
            inputData.loyaltyStatus = document.getElementById('loyaltyStatus').value;
            inputData.purchaseAmount = document.getElementById('purchaseAmount').value;
            break;
        default:
            console.error('Invalid model ID');
            return;
    }

    getToken(modelId, (err) => console.log(err), function () {
        let tokenResponse;
        try {
            tokenResponse = JSON.parse(this.responseText);
        } catch (ex) {
            // TODO: handle parsing exception
        }

        const scoring_url = "https://private.us-south.ml.cloud.ibm.com/ml/v4/deployments/YOUR_MODEL_DEPLOYMENT_ID/predictions?version=2021-05-01"; // Replace with your model's scoring URL
        const payload = JSON.stringify({
            input_data: [{
                fields: Object.keys(inputData),
                values: [Object.values(inputData)]
            }]
        });

        // Set a timeout for 10 seconds
        const timeout = setTimeout(() => {
            Swal.fire({
                title: 'Error!',
                text: 'No response received within 10 seconds. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }, 10000); // 10 seconds

        apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
            clearTimeout(timeout); // Clear the timeout if we get a response
            let parsedPostResponse;
            try {
                parsedPostResponse = JSON.parse(this.responseText);
            } catch (ex) {
                // TODO: handle parsing exception
            }
            displayPredictionResult(`Prediction Result: ${parsedPostResponse.predictions[0].values[0][0]}`);
        }, function (error) {
            clearTimeout(timeout); // Clear the timeout if there's an error
            console.log(error);
            Swal.fire({
                title: 'Error!',
                text: 'Lite version CuH for models exhausted, try 1 month later.',
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
