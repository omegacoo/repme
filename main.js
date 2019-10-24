const BASE_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';
const apiKey = 'AIzaSyBpylwFzws1j6fnwaEkhdvi3o6Z4uXJWwg';

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

// Temporary arrays just to test getReps
let fedArray = [];

let stateArray = [];

let localArray = [];

// Handle card swap
function onCardSwap(){
    let repArr;

    $('#js-right').on('click', function(){
        switch(STATE.LEVEL){
            case 'federal':
                repArr = fedArray;
                break;
            case 'state':
                repArr = stateArray;
                break;
            case 'local':
                repArr = localArray;
                break;
        };
        if(STATE.REP < repArr.length - 1){
            STATE.REP += 1
            fillRepCard();
            updateScreen();
        }
    })
    $('#js-left').on('click', function(){
        switch(STATE.LEVEL){
            case 'federal':
                repArr = fedArray;
                break;
            case 'state':
                repArr = stateArray;
                break;
            case 'local':
                repArr = localArray;
                break;
        };
        if(STATE.REP > 0){
            STATE.REP -= 1
            fillRepCard();
            updateScreen();
        }
    })
}

// Populate Rep Card
function fillRepCard(){
    switch(STATE.LEVEL){
        case 'federal':
            $('#title').text(fedArray[STATE.REP].title);
            $('#name').text(fedArray[STATE.REP].name);
            $('#party').text(fedArray[STATE.REP].party);
            break;
        case 'state':
            $('#title').text(stateArray[STATE.REP].title);
            $('#name').text(stateArray[STATE.REP].name);
            $('#party').text(stateArray[STATE.REP].party);
            break;
        case 'local':
            $('#title').text(localArray[STATE.REP].title);
            $('#name').text(localArray[STATE.REP].name);
            $('#party').text(localArray[STATE.REP].party);
            break;
    }
}

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

    console.log(json);

    for(let i = 0; i < fedIndices.length; i++){
        for(let j = 0; j < offices[fedIndices[i]].officialIndices.length; j++){
            fedArray.push({
                title: offices[fedIndices[i]].name,
                name: officials[offices[fedIndices[i]].officialIndices[j]].name,
                party: officials[offices[fedIndices[i]].officialIndices[j]].party
            })
        };
    };

    for(let i = 0; i < stateIndices.length; i++){
        for(let j = 0; j < offices[stateIndices[i]].officialIndices.length; j++){
            stateArray.push({
                title: offices[stateIndices[i]].name,
                name: officials[offices[stateIndices[i]].officialIndices[j]].name,
                party: officials[offices[stateIndices[i]].officialIndices[j]].party
            });
        };
    };

    for(let i = 0; i < localIndices.length; i++){
        for(let j = 0; j < offices[localIndices[i]].officialIndices.length; j++){
            localArray.push({
                title: offices[localIndices[i]].name,
                name: officials[offices[localIndices[i]].officialIndices[j]].name,
                party: officials[offices[localIndices[i]].officialIndices[j]].party
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
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            handleJson(responseJson);
        })
        .catch(err => {
            alert(err);
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
        STATE.SCREEN = screens.LEVEL_SELECT;
        updateScreen();
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
    onAddressSubmit();
    onBackClick();
    onLevelSelect();
    onRepPick();
    onCardSwap();
};

$(App);