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
            $('#js-image').html(`<img class="js-rep-image" src="${fedArray[STATE.REP].image}" alt="${fedArray[STATE.REP].name}">`);
            $('#phone').text(`Phone: ${fedArray[STATE.REP].phone}`);
            if(fedArray[STATE.REP].social_media.facebook !== 'unknown'){
                $('#facebook').text(`Facebook: `)
                    .append(`<a href="https://www.facebook.com/${fedArray[STATE.REP].social_media.facebook}" 
                                target="_blank">
                                    ${fedArray[STATE.REP].social_media.facebook}
                            </a>`);
            } else {
                $('#facebook').text('Facebook: unknown');
            };
            if(fedArray[STATE.REP].phone !== 'unknown'){
                $('#phone').text(`Phone: `)
                    .append(`<a href="https://www.facebook.com/${fedArray[STATE.REP].phone}" 
                                target="_blank">
                                    ${fedArray[STATE.REP].phone}
                            </a>`);
            } else {
                $('#phone').text('Phone: unknown');
            };
            break;
        case 'state':
            $('#title').text(stateArray[STATE.REP].title);
            $('#name').text(stateArray[STATE.REP].name);
            $('#party').text(stateArray[STATE.REP].party);
            $('#js-image').html(`<img class="js-rep-image" src="${stateArray[STATE.REP].image}" alt="${stateArray[STATE.REP].name}">`);
            $('#phone').text(`Phone: ${stateArray[STATE.REP].phone}`);
            if(stateArray[STATE.REP].social_media.facebook !== 'unknown'){
                $('#facebook').text(`Facebook: `)
                    .append(`<a href="https://www.facebook.com/${stateArray[STATE.REP].social_media.facebook}" 
                                target="_blank">
                                    ${stateArray[STATE.REP].social_media.facebook}
                            </a>`);
            } else {
                $('#facebook').text('Facebook: unknown');
            };
            if(stateArray[STATE.REP].phone !== 'unknown'){
                $('#phone').text(`Phone: `)
                    .append(`<a href="https://www.facebook.com/${stateArray[STATE.REP].phone}" 
                                target="_blank">
                                    ${stateArray[STATE.REP].phone}
                            </a>`);
            } else {
                $('#phone').text('Phone: unknown');
            };
            break;
        case 'local':
            $('#title').text(localArray[STATE.REP].title);
            $('#name').text(localArray[STATE.REP].name);
            $('#party').text(localArray[STATE.REP].party);
            $('#js-image').html(`<img class="js-rep-image" src="${localArray[STATE.REP].image}" alt="${localArray[STATE.REP].name}">`);
            $('#phone').text(`Phone: ${localArray[STATE.REP].phone}`);
            if(localArray[STATE.REP].social_media.facebook !== 'unknown'){
                $('#facebook').text(`Facebook: `)
                    .append(`<a href="https://www.facebook.com/${localArray[STATE.REP].social_media.facebook}" 
                                target="_blank">
                                    ${localArray[STATE.REP].social_media.facebook}
                            </a>`);
            } else {
                $('#facebook').text('Facebook: unknown');
            };
            if(localArray[STATE.REP].phone !== 'unknown'){
                $('#phone').text(`Phone: `)
                    .append(`<a href="https://www.facebook.com/${localArray[STATE.REP].phone}" 
                                target="_blank">
                                    ${localArray[STATE.REP].phone}
                            </a>`);
            } else {
                $('#phone').text('Phone: unknown');
            };
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