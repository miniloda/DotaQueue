let remove = document.getElementsByClassName('remove')[0];
let input = document.querySelector('input');

input.addEventListener('keyup', function() {
    console.log("?")
    if (input.value.length > 0) {
        remove.style.display = 'block';
    } else {
        remove.style.display = 'none';
    }
});
remove.addEventListener('click', function() {
    input.value = '';
    remove.style.display = 'none';
});