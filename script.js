document.addEventListener('DOMContentLoaded', function () {
    let searchData = [];

    async function fetchData() {
        try {
            const response = await fetch('https://mocki.io/v1/36c32f7c-dee4-4a4a-a093-b3a9aae0c0bc');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    function renderData(data) {
        searchData = data;
        const tableDataBody = document.getElementById('table-data-body');

        data.forEach(item => {
            const row = document.createElement('tr');
            row.classList.add('data-row');

            row.innerHTML = `
                <td class="column1">${item.id}</td>
                <td class="column2">${item.firstName}</td>
                <td class="column3">${item.lastName}</td>
                <td class="column4">${item.email}</td>
                <td class="column5">${item.phone}</td>
            `;

            row.addEventListener('click', () => displayDetails(item));

            tableDataBody.appendChild(row);
        });
    }

    function displayDetails(item) {
        const infoContent = document.getElementById('info-content');
        infoContent.innerHTML = `
            <div><b>User selected:</b> ${item.firstName} ${item.lastName}</div>
            <div><b>Email:</b> ${item.email}</div>
            <div><b>Phone:</b> ${item.phone}</div>
            <div><b>Description: </b>${item.description}</div>
            <div><b>Address:</b> ${item.address.streetAddress}, ${item.address.city}, ${item.address.state} ${item.address.zip}</div>
        `;

        const rows = document.querySelectorAll(".data-row");
        rows.forEach(function (row) {
            row.classList.remove("highlight");
        });

        event.currentTarget.classList.add("highlight");
    }

    function handleLiveSearch() {
        const searchBox = document.getElementById('search-box');
        searchBox.addEventListener('input', () => {
            const searchTerm = searchBox.value.trim().toLowerCase();
            const filteredData = searchData.filter(item => item.firstName.toLowerCase().includes(searchTerm));
            renderFilteredData(filteredData, searchTerm);
        });
    }

    function renderFilteredData(filteredData, searchTerm) {
        const tableDataBody = document.getElementById('table-data-body');
        tableDataBody.innerHTML = '';

        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.classList.add('data-row');

            row.innerHTML = `
                <td class="column1">${item.id}</td>
                <td class="column2">${highlightSearchTerm(item.firstName, searchTerm)}</td>
                <td class="column3">${highlightSearchTerm(item.lastName, searchTerm)}</td>
                <td class="column4">${highlightSearchTerm(item.email, searchTerm)}</td>
                <td class="column5">${highlightSearchTerm(item.phone, searchTerm)}</td>
            `;

            row.addEventListener('click', () => displayDetails(item));

            tableDataBody.appendChild(row);
        });
    }

    function highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) {
            return text;
        }

        const regex = new RegExp(searchTerm, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }

    fetchData()
        .then(data => {
            renderData(data);
            handleLiveSearch();
        })
        .catch(error => {
            console.error('Error during initialization:', error);
        });
});
