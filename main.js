

function onSubmit(){
    $('#js-form').on('submit', function(e){
        e.preventDefault();
        console.log('Form Submitted!');
    });
};

function App(){
    onSubmit();
};

$(App);