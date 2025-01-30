let currentPage = 1;
const tagsPerPage = 1;
let tags = [];

document.getElementById('discountForm').addEventListener('submit', function(event) {
    event.preventDefault();
    generateTags();
});

function addItem() {
    const itemsTable = document.getElementById('itemsTable');
    const newRow = itemsTable.insertRow();
    
    newRow.innerHTML = `
        <td><input type="text" name="itemName" required></td>
        <td><input type="number" name="originalPrice" step="0.01" required></td>
        <td><input type="number" name="discountPercentage" required></td>
        <td><input type="number" name="plu" required></td>
    `;
}

function generateTags() {
    const itemsTable = document.getElementById('itemsTable');
    const rows = itemsTable.getElementsByTagName('tr');
    tags = [];

    // Skip the header row
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const itemName = cells[0].getElementsByTagName('input')[0].value;
        const originalPrice = parseFloat(cells[1].getElementsByTagName('input')[0].value);
        const discountPercentage = parseFloat(cells[2].getElementsByTagName('input')[0].value);
        const plu = parseInt(cells[3].getElementsByTagName('input')[0].value);

        let tagContent;

        if (discountPercentage === 0) {
            tagContent = `
                <div class="tag">
                    <center>
                        <div class="item-name">${itemName}</div>
                        <div class="now-price">Price: Rs:${originalPrice.toFixed(2)}</div>
                        <div class="plu">PLU: ${plu}</div>
                    </center>
                </div>
            `;
        } else {
            const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
            tagContent = `
                <div class="tag">
                    <center>
                        <div class="item-name">${itemName}</div>
                        <div class="discount">${discountPercentage}% OFF</div>
                        <div class="before-price">Was: Rs:<del>${originalPrice.toFixed(2)}</del></div>
                        <div class="now-price">Now: Rs:${discountedPrice.toFixed(2)}</div>
                        <div class="plu">PLU: ${plu}</div>
                    </center>
                </div>
            `;
        }
        tags.push(tagContent);
    }

    displayTags();
}

function displayTags() {
    const tagOutput = document.getElementById('tagOutput');
    const paginationControls = document.getElementById('paginationControls');
    const totalPages = Math.ceil(tags.length / tagsPerPage);

    // Clear previous content
    tagOutput.innerHTML = '';
    paginationControls.innerHTML = '';

    // Calculate the range of tags to display for the current page
    const startIndex = (currentPage - 1) * tagsPerPage;
    const endIndex = Math.min(startIndex + tagsPerPage, tags.length);
    const tagsToDisplay = tags.slice(startIndex, endIndex);

    // Display tags
    tagsToDisplay.forEach(tag => {
        tagOutput.innerHTML += tag;
    });

    // Create pagination controls
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            currentPage = i;
            displayTags();
        });
        paginationControls.appendChild(button);
    }
}

function printTags() {
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow.document.write('<html><head><title>Print Tags</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(document.getElementById('tagOutput').innerHTML);
    printWindow.document.write('<div class="pagebreak"> </div></body></html>');
    printWindow.document.close();
    printWindow.print();
}