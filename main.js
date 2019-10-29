const BASE_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';
const apiKey = 'AIzaSyBpylwFzws1j6fnwaEkhdvi3o6Z4uXJWwg';
const flagImage = 'https://www.pixelstalk.net/wp-content/uploads/images1/Download-American-Flag-Pictures.jpg';

const screens = Object.freeze({
    LANDING: 'landing',
    LEVEL_SELECT: 'level_select',
    REP_PICK: 'rep_pick',
    REP_CARD: 'rep_card'
});

const levels = Object.freeze({
    FEDERAL: 'federal',
    STATE: 'state',
    LOCAL: 'local'
});

const STATE = {
    SCREEN: screens.LANDING,
    LEVEL: levels.FEDERAL,
    REP: 0
};

let fedArray = [];

let stateArray = [];

let localArray = [];

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
        let repArr = getLevelArray();

        if(STATE.REP < repArr.length - 1){
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
    $('#js-image').html(`<img class="js-rep-image" src="${currentArray[STATE.REP].image}" alt="${currentArray[STATE.REP].name}">`);
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

function fillRepCard(){
    let currentArray = getLevelArray();

    setRepCardTitle(currentArray);
    setRepCardName(currentArray);
    setRepCardParty(currentArray);
    setRepCardImage(currentArray);
    setRepCardFacebook(currentArray);
    setRepCardPhone(currentArray);
};

// Handle rep pick
function onRepPick(){
    $('.js-rep-pick').on('click', 'button', function(e){
        STATE.SCREEN = screens.REP_CARD;
        STATE.REP = parseInt(this.id);
        updateScreen();
    });
};

// Create the Rep buttons
function getReps(){
    switch(STATE.LEVEL){
        case 'federal':
            for(let i = 0; i < fedArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${fedArray[i].title}
                    </button>`
                );
            };
            break;
        case 'state':
            for(let i = 0; i < stateArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${stateArray[i].title}
                    </button>`
                ); 
            };
            break;
        case 'local':
            for(let i = 0; i < localArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${localArray[i].title}
                    </button>`
                );
            };
            break;
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
            case 'level_select':
                STATE.SCREEN = screens.LANDING;
                break;
            case 'rep_pick':
                STATE.SCREEN = screens.LEVEL_SELECT;
                $('.js-rep-pick').empty();
                break;
            case 'rep_card':
                STATE.SCREEN = screens.REP_PICK
                break;
        }
        updateScreen();
    });
};

function handleJson(json){
    let divisions = json.divisions;
    let offices = json.offices;
    let officials = json.officials;
    let fedOffices = divisions['ocd-division/country:us'].officeIndices;
    let state = json.normalizedInput.state.toLowerCase();
    let stateOffices = divisions[`ocd-division/country:us/state:${state}`].officeIndices;
    
    let fedIndices = [];
    let stateIndices = [];
    let localIndices = [];

    for(let i = 0; i < fedOffices.length; i++){
        fedIndices.push(fedOffices[i]);
    };
    for(let i = 0; i < stateOffices.length; i++){
        stateIndices.push(stateOffices[i]);
    };

    // Put all indices not in either fedIndices or stateIndices into localIndices
    for(let i = 0; i < offices.length; i++){
        let foundFed = fedIndices.indexOf(i);
        let foundState = stateIndices.indexOf(i);

        if(foundFed === -1 && foundState === -1){
            localIndices.push(i)
        };
    };

    for(let i = 0; i < fedIndices.length; i++){
        for(let j = 0; j < offices[fedIndices[i]].officialIndices.length; j++){
            let picture;
            let facebook;
            let phones;
            if(officials[offices[fedIndices[i]].officialIndices[j]].photoUrl){
                picture = officials[offices[fedIndices[i]].officialIndices[j]].photoUrl;
            } else {
                picture = flagImage;
            };
            if(officials[offices[fedIndices[i]].officialIndices[j]].channels){
                facebook = officials[offices[fedIndices[i]].officialIndices[j]].channels[0].id;
            } else {
                facebook = 'unknown';
            }
            if(officials[offices[fedIndices[i]].officialIndices[j]].phones){
                phones = officials[offices[fedIndices[i]].officialIndices[j]].phones[0];
            } else {
                phones = 'unknown';
            }

            fedArray.push({
                title: offices[fedIndices[i]].name,
                name: officials[offices[fedIndices[i]].officialIndices[j]].name,
                party: officials[offices[fedIndices[i]].officialIndices[j]].party,
                image: picture,
                phone: phones,
                social_media: {
                    facebook: facebook
                }
            })
        };
    };

    for(let i = 0; i < stateIndices.length; i++){
        for(let j = 0; j < offices[stateIndices[i]].officialIndices.length; j++){
            let picture;
            let facebook;
            let phone;
            if(officials[offices[stateIndices[i]].officialIndices[j]].photoUrl){
                picture = officials[offices[stateIndices[i]].officialIndices[j]].photoUrl;
            } else {
                picture = flagImage;
            };
            if(officials[offices[stateIndices[i]].officialIndices[j]].channels){
                facebook = officials[offices[stateIndices[i]].officialIndices[j]].channels[0].id;
            } else {
                facebook = 'unknown';
            }
            if(officials[offices[stateIndices[i]].officialIndices[j]].phones){
                phones = officials[offices[stateIndices[i]].officialIndices[j]].phones[0];
            } else {
                phones = 'unknown';
            }

            stateArray.push({
                title: offices[stateIndices[i]].name,
                name: officials[offices[stateIndices[i]].officialIndices[j]].name,
                party: officials[offices[stateIndices[i]].officialIndices[j]].party,
                image: picture,
                phone: phones,
                social_media: {
                    facebook: facebook
                }
            });
        };
    };

    for(let i = 0; i < localIndices.length; i++){
        for(let j = 0; j < offices[localIndices[i]].officialIndices.length; j++){
            let picture;
            let facebook;
            let phones;
            if(officials[offices[localIndices[i]].officialIndices[j]].photoUrl){
                picture = officials[offices[localIndices[i]].officialIndices[j]].photoUrl;
            } else {
                picture = flagImage;
            };
            if(officials[offices[localIndices[i]].officialIndices[j]].channels){
                facebook = officials[offices[localIndices[i]].officialIndices[j]].channels[0].id;
            } else {
                facebook = 'unknown';
            }
            if(officials[offices[localIndices[i]].officialIndices[j]].phones){
                phones = officials[offices[localIndices[i]].officialIndices[j]].phones[0];
            } else {
                phones = 'unknown';
            }

            localArray.push({
                title: offices[localIndices[i]].name,
                name: officials[offices[localIndices[i]].officialIndices[j]].name,
                party: officials[offices[localIndices[i]].officialIndices[j]].party,
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
}

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
                updateScreen();

                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            handleJson(responseJson);
        })
        .catch(err => {
            alert(err);
            STATE.SCREEN = screens.LANDING;
            updateScreen();
        });
};

// Handle address form submit
function onAddressSubmit(){
    $('#js-form').on('submit', function(e){
        e.preventDefault();

        fedArray = [];
        stateArray = [];
        localArray = [];

        getResults($('#js-address').val());
    });
};

function onAddressFocus(){
    $('#js-address').on('click', function(e){
        $('#js-address').val('');
    });
};

// Draw the screen depending on the current STATE
function updateScreen(){  

    switch(STATE.SCREEN){
        case 'landing':
            $('.js-landing').removeClass('hidden');
            $('.js-level-select').addClass('hidden');
            $('.js-rep-pick').addClass('hidden');
            $('.js-rep-card').addClass('hidden');
            $('.back').addClass('hidden');
            break;
        case 'level_select':
            $('.js-landing').addClass('hidden');
            $('.js-level-select').removeClass('hidden');
            $('.js-rep-pick').addClass('hidden');
            $('.js-rep-card').addClass('hidden');
            $('.back').removeClass('hidden');
            break;
        case 'rep_pick':
            $('.js-landing').addClass('hidden');
            $('.js-level-select').addClass('hidden');
            $('.js-rep-pick').removeClass('hidden');
            $('.js-rep-card').addClass('hidden');
            $('.back').removeClass('hidden');
            break;
        case 'rep_card':
            $('.js-landing').addClass('hidden');
            $('.js-level-select').addClass('hidden');
            $('.js-rep-pick').addClass('hidden');
            $('.js-rep-card').removeClass('hidden');
            $('.back').removeClass('hidden');

            fillRepCard();
            break;
    };
};

function App(){
    updateScreen();
    onAddressFocus();
    onAddressSubmit();
    onBackClick();
    onLevelSelect();
    onRepPick();
    onCardSwap();
};

$(App);