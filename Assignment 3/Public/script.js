function showDescription(file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById('description').innerText = data;
        })
        .catch(error => console.error('Error loading the file:', error));
}