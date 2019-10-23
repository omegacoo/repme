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
const fedArray = [];

const stateArray = [];

const localArray = [];

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
    let federalMax = divisions['ocd-division/country:us'].officeIndices[divisions['ocd-division/country:us'].officeIndices.length - 1];
    let state = json.normalizedInput.state.toLowerCase();
    let stateMax = divisions[`ocd-division/country:us/state:${state}`].officeIndices[divisions[`ocd-division/country:us/state:${state}`].officeIndices.length - 1]

    console.log(json);
    for(let i = 0; i < offices.length; i++){
        for(let j = 0; j < offices[i].officialIndices.length; j++){
            if(i <= federalMax){
                fedArray.push({
                    title: offices[i].name,
                    name: officials[offices[i].officialIndices[j]].name,
                    party: officials[offices[i].officialIndices[j]].party
                })
            } else if(i <= stateMax){
                stateArray.push({
                    title: offices[i].name,
                    name: officials[offices[i].officialIndices[j]].name,
                    party: officials[offices[i].officialIndices[j]].party
                })
            } else {
                localArray.push({
                    title: offices[i].name,
                    name: officials[offices[i].officialIndices[j]].name,
                    party: officials[offices[i].officialIndices[j]].party
                })
            }
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