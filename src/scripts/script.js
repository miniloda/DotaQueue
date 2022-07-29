let remove = document.getElementsByClassName('remove')[0];
 

document.querySelector('input').addEventListener('keyup', function() {
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
