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
const fakeFedArray = [
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    },
    {
        title: 'President',
        name: 'Trump',
        party: 'Republican'
    },
    {
        title: 'Vice President',
        name: 'Pence',
        party: 'Republican'
    }
];

const fakeStateArray = [
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    },
    {
        title: 'Governor',
        name: 'Abbot',
        party: 'Republican'
    }
];

const fakeLocalArray = [
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    },
    {
        title: 'Mayor',
        name: 'McCoy',
        party: 'Republican'
    }
];

// Handle card swap
function onCardSwap(){
    let repArr;

    switch(STATE.LEVEL){
        case 'federal':
            repArr = fakeFedArray;
            break;
        case 'state':
            repArr = fakeStateArray;
            break;
        case 'local':
            repArr = fakeLocalArray;
            break;
    }
    $('#js-right').on('click', function(){
        if(STATE.REP < repArr.length - 1){
            STATE.REP += 1
        }
        fillRepCard();
        updateScreen();
    })
    $('#js-left').on('click', function(){
        if(STATE.REP > 0){
            STATE.REP -= 1
        }
        fillRepCard();
        updateScreen();
    })
}

// Populate Rep Card
function fillRepCard(){
    switch(STATE.LEVEL){
        case 'federal':
            $('#title').text(fakeFedArray[STATE.REP].title);
            $('#name').text(fakeFedArray[STATE.REP].name);
            $('#party').text(fakeFedArray[STATE.REP].party);
            break;
        case 'state':
            $('#title').text(fakeStateArray[STATE.REP].title);
            $('#name').text(fakeStateArray[STATE.REP].name);
            $('#party').text(fakeStateArray[STATE.REP].party);
            break;
        case 'local':
            $('#title').text(fakeLocalArray[STATE.REP].title);
            $('#name').text(fakeLocalArray[STATE.REP].name);
            $('#party').text(fakeLocalArray[STATE.REP].party);
            break;
    }
}

// Handle rep pick
function onRepPick(){
    $('.js-rep-pick').on('click', 'button', function(e){
        STATE.SCREEN = screens.REP_CARD;
        STATE.REP = this.id;
        updateScreen();
    });
};

// Create the Rep buttons
function getReps(){
    switch(STATE.LEVEL){
        case 'federal':
            for(let i = 0; i < fakeFedArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${fakeFedArray[i].title}
                    </button>`
                );
            };
            break;
        case 'state':
            for(let i = 0; i < fakeStateArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${fakeStateArray[i].title}
                    </button>`
                ); 
            };
            break;
        case 'local':
            for(let i = 0; i < fakeLocalArray.length; i++){
                $('.js-rep-pick').append(
                    `<button id="${i}" class="js-rep-button">
                        ${fakeLocalArray[i].title}
                    </button>`
                );
            };
            break;
    };
};

// Query the API
function getResults(){
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

// Handle address form submit
function onAddressSubmit(){
    $('#js-form').on('submit', function(e){
        e.preventDefault();

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
    getResults();
    onBackClick();
    onLevelSelect();
    onRepPick();
    onCardSwap();
};

$(App);