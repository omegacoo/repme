const screens = Object.freeze({
    LANDING: 'landing',
    LEVEL_SELECT: 'level_select',
    REP_PICK: 'rep_pick',
    REP_CARD: 'rep_card'
});

const STATE = {
    SCREEN: screens.LANDING
};

function levelSelect(){
    $('#js-landing').addClass('hidden');
    $('#js-level-select').removeClass('hidden');
}

function getResults(){
    // fill in later
}

function onBackClick(){
    $('.back').on('click', function(e){
        e.preventDefault();
        
        switch(STATE.SCREEN){
            case 'level_select':
                STATE.SCREEN = screens.LANDING;
                break;
            case 'rep_pick':
                STATE.SCREEN = screens.LEVEL_SELECT;
                break;
            case 'rep_card':
                STATE.SCREEN = screens.REP_PICK
                break;
        }
        showScreen();
    })

}

function onAddressSubmit(){
    $('#js-form').on('submit', function(e){
        e.preventDefault();

        STATE.SCREEN = screens.LEVEL_SELECT;
        showScreen();
    });
};

function showScreen(){

    switch(STATE.SCREEN){
        case 'landing':
            $('.js-landing').removeClass('hidden');
            $('.js-level-select').addClass('hidden');
            $('.back').addClass('hidden');
            break;
        case 'level_select':
            $('.js-level-select').removeClass('hidden');
            $('.js-landing').addClass('hidden');
            $('.back').removeClass('hidden');
            break;
        case 'rep_pick':
            $('.back').removeClass('hidden');
            break;
        case 'rep_card':
            $('.back').removeClass('hidden');
            break;
    }
}

function App(){
    showScreen();
    onAddressSubmit();
    onBackClick();
};

$(App);