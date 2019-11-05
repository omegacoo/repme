const BASE_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';
const apiKey = 'AIzaSyBpylwFzws1j6fnwaEkhdvi3o6Z4uXJWwg';
const flagImage = new Image();
flagImage.src = 'https://www.pixelstalk.net/wp-content/uploads/images1/Download-American-Flag-Pictures.jpg';

const screens = Object.freeze({
    SPLASH: 'splash',
    LANDING: 'landing',
    LEVEL_SELECT: 'level-select',
    REP_PICK: 'rep-pick',
    REP_CARD: 'rep-card'
});

const levels = Object.freeze({
    FEDERAL: 'federal',
    STATE: 'state',
    LOCAL: 'local'
});

const STATE = {
    SCREEN: screens.SPLASH,
    LEVEL: levels.FEDERAL,
    REP: 0
};

let fedArray = [];
let stateArray = [];
let localArray = [];

function resetArrays(){
    fedArray = [];
    stateArray = [];
    localArray = [];
};

function getLevelArray(){
    switch(STATE.LEVEL){
        case 'federal':
            return fedArray;
        case 'state':
            return stateArray;
        case 'local':
            return localArray;
    };
};

// Handle card swap
function leftArrow(){
    $('#js-left').on('click', function(){
        if(STATE.REP > 0){
            STATE.REP -= 1
            fillRepCard();
            updateScreen();
        };
    });
};

function rightArrow(){
    $('#js-right').on('click', function(){
        let currentArray = getLevelArray();

        if(STATE.REP < currentArray.length - 1){
            STATE.REP += 1
            fillRepCard();
            updateScreen();
        };
    });
};

function onCardSwap(){
    rightArrow();
    leftArrow();
};

// Populate Rep Card
function setRepCardTitle(currentArray){
    $('#title').text(currentArray[STATE.REP].title);
};

function setRepCardName(currentArray){
    $('#name').text(currentArray[STATE.REP].name);
};

function setRepCardParty(currentArray){
    $('#party').text(currentArray[STATE.REP].party);
};

function setRepCardImage(currentArray){
    $('#js-image').html(currentArray[STATE.REP].image);
};

function setRepCardFacebook(currentArray){
    if(currentArray[STATE.REP].social_media.facebook !== 'unknown'){
        $('#facebook').text(`Facebook: `)
            .append(`<a href="https://www.facebook.com/${currentArray[STATE.REP].social_media.facebook}" 
                        target="_blank">
                            ${currentArray[STATE.REP].social_media.facebook}
                    </a>`);
    } else {
        $('#facebook').text('Facebook: unknown');
    };
};

function setRepCardPhone(currentArray){
    if(currentArray[STATE.REP].phone !== 'unknown'){
        $('#phone').text(`Phone: `)
            .append(`${currentArray[STATE.REP].phone}`);
    } else {
        $('#phone').text('Phone: unknown');
    };
};

function setRepCardArrows(currentArray){
    if(STATE.REP === 0 && STATE.REP === currentArray.length - 1){
        $('#js-left').addClass('hidden');
        $('#js-right').addClass('hidden');
    } else if(STATE.REP === 0){
        $('#js-left').addClass('hidden');
        $('#js-right').removeClass('hidden');
    } else if(STATE.REP === currentArray.length - 1){
        $('#js-right').addClass('hidden');
        $('#js-left').removeClass('hidden');
    } else {
        $('#js-left').removeClass('hidden');
        $('#js-right').removeClass('hidden');
    };
};

function fillRepCard(){
    let currentArray = getLevelArray();

    setRepCardTitle(currentArray);
    setRepCardName(currentArray);
    setRepCardParty(currentArray);
    setRepCardImage(currentArray);
    setRepCardFacebook(currentArray);
    setRepCardPhone(currentArray);
    setRepCardArrows(currentArray);
};

// Handle rep pick
function onRepPick(){
    $('.js-rep-pick').on('click', 'button', function(){
        STATE.SCREEN = screens.REP_CARD;
        STATE.REP = parseInt(this.id);
        fillRepCard();
        updateScreen();
    });
};

// Create the Rep buttons
function getReps(){
    let currentArray = getLevelArray();

    for(let i = 0; i < currentArray.length; i++){
        $('.js-rep-pick').append(
            `<button id="${i}" class="js-rep-button">
                ${currentArray[i].title}
            </button>`
        );
    };
};

// Handle level selection
function onLevelSelect(){
    $('.js-level-button').on('click', function(e){
        switch(this.id){
            case 'federal':
                STATE.LEVEL = levels.FEDERAL;
                break;
            case 'state':
                STATE.LEVEL = levels.STATE;
                break;
            case 'local':
                STATE.LEVEL = levels.LOCAL;
                break;
        };
        STATE.SCREEN = screens.REP_PICK;
        getReps();
        updateScreen();
    });
};

// Handle back button click on all but landing screen
function onBackClick(){
    $('.back').on('click', function(e){
        switch(STATE.SCREEN){
            case 'landing':
                STATE.SCREEN = screens.SPLASH;
                break;
            case 'level-select':
                STATE.SCREEN = screens.LANDING;
                break;
            case 'rep-pick':
                STATE.SCREEN = screens.LEVEL_SELECT;
                $('.js-rep-pick').empty();
                break;
            case 'rep-card':
                STATE.SCREEN = screens.REP_PICK
                break;
        }
        updateScreen();
    });
};

// Parse API data
function getIndices(offices){
    let indices = [];

    for(let i = 0; i < offices.length; i++){
        indices.push(offices[i]);
    };

    return indices;
};

function getRemainingIndices(offices, firstIndices, secondIndices){
    let indices = [];

    for(let i = 0; i < offices.length; i++){
        let foundFed = firstIndices.indexOf(i);
        let foundState = secondIndices.indexOf(i);

        if(foundFed === -1 && foundState === -1){
            indices.push(i)
        };
    };

    return indices;
};

function parseJson(json){
    let divisions = json.divisions;
    let offices = json.offices;
    let officials = json.officials;
    
    let fedOffices = divisions['ocd-division/country:us'].officeIndices;
    let state = json.normalizedInput.state.toLowerCase();
    let stateOffices = divisions[`ocd-division/country:us/state:${state}`].officeIndices;
    
    let fedIndices = getIndices(fedOffices);
    let stateIndices = getIndices(stateOffices);
    let localIndices = getRemainingIndices(offices, fedIndices, stateIndices);

    let total = fedIndices.length + stateIndices.length + localIndices.length;

    for(let i = 0; i < total; i++){
        let currentIndices;
        let currentArray;
        let currentIndex;

        if(i < fedIndices.length){
            currentIndices = fedIndices;
            currentArray = fedArray;
            currentIndex = i;
        } else if(i < fedIndices.length + stateIndices.length){
            currentIndices = stateIndices;
            currentArray = stateArray;
            currentIndex = i - fedIndices.length;
        } else {
            currentIndices = localIndices;
            currentArray = localArray;
            currentIndex = i - (fedIndices.length + stateIndices.length);
        };

        for(let j = 0; j < offices[currentIndices[currentIndex]].officialIndices.length; j++){
            let picture;
            let facebook;
            let phones;
            if(officials[offices[currentIndices[currentIndex]].officialIndices[j]].photoUrl){
                picture = new Image();
                picture.src = officials[offices[currentIndices[currentIndex]].officialIndices[j]].photoUrl;
            } else {
                picture = flagImage;
            };
            if(officials[offices[currentIndices[currentIndex]].officialIndices[j]].channels){
                facebook = officials[offices[currentIndices[currentIndex]].officialIndices[j]].channels[0].id;
            } else {
                facebook = 'unknown';
            }
            if(officials[offices[currentIndices[currentIndex]].officialIndices[j]].phones){
                phones = officials[offices[currentIndices[currentIndex]].officialIndices[j]].phones[0];
            } else {
                phones = 'unknown';
            };

            currentArray.push({
                title: offices[currentIndices[currentIndex]].name,
                name: officials[offices[currentIndices[currentIndex]].officialIndices[j]].name,
                party: officials[offices[currentIndices[currentIndex]].officialIndices[j]].party,
                image: picture,
                phone: phones,
                social_media: {
                    facebook: facebook
                }
            });
        };
    };
};

function formatQuery(params){
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
};

// Query the API
function getResults(query){
    const params = {
        key: apiKey,
        address: query
    };

    const queryString = formatQuery(params);
    const url = BASE_URL + '?' + queryString;

    fetch(url)
        .then(response => {
            if(response.ok){
                STATE.SCREEN = screens.LEVEL_SELECT;
                $('#error').text('');
                updateScreen();

                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            parseJson(responseJson);
        })
        .catch(err => {
            errorHandle(err);
            STATE.SCREEN = screens.LANDING;
            updateScreen();
        });
};

// Handle incorrect input
function errorHandle(error){
    $('#error').text(error);
};

// Handle address form submit
function onAddressSubmit(){
    $('#js-form').on('submit', function(e){
        e.preventDefault();

        resetArrays();

        getResults($('#js-address').val());
    });
};

function onAddressFocus(){
    $('#js-address').on('click', function(e){
        $('#js-address').val('');
    });
};

function onBegin(){
    $('#js-begin').on('click', function(){
        STATE.SCREEN = screens.LANDING;
        updateScreen();
    });
};

// Draw the screen depending on the current STATE
function updateScreen(){
    const screens = ['splash', 'landing', 'level-select', 'rep-pick', 'rep-card'];

    for(let i = 0; i < screens.length; i++){
        if(screens[i] === STATE.SCREEN){
            $(`.js-${screens[i]}`).removeClass('hidden');
        } else {
            $(`.js-${screens[i]}`).addClass('hidden');
        };
    };

    if(STATE.SCREEN === 'splash' || STATE.SCREEN === 'landing'){
        $('.back').addClass('hidden');
    } else {
        $('.back').removeClass('hidden');
    };
};

function initializeScreens(){
    $('.js-landing').addClass('hidden');
    $('.js-level-select').addClass('hidden');
    $('.js-rep-pick').addClass('hidden');
    $('.js-rep-card').addClass('hidden');
    $('.back').addClass('hidden');
};

function App(){
    initializeScreens();
    onBegin();
    onAddressFocus();
    onAddressSubmit();
    onBackClick();
    onLevelSelect();
    onRepPick();
    onCardSwap();
};

$(App);