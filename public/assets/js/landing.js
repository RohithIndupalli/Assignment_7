// Function to toggle dropdown menus
function toggleDropdown(type) {
    const content = document.getElementById(`${type}-content`);
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}


// Function to fetch countries and populate dropdown
async function fetchCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    const countryDropdown = document.getElementById('country-dropdown');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;
        countryDropdown.appendChild(option);
    });
}


// Fetch jobs, cities, and companies based on country selection
async function fetchJobsByCountry() {
    const selectedCountry = document.getElementById('country-dropdown').value;

    if (selectedCountry) {
        // Fetch job details from an API based on the selected country
        const jobData = await getJobDataByCountry(selectedCountry);
        
        // Populate Jobs
        const jobsList = document.getElementById('jobs-list');
        jobsList.innerHTML = ''; // Clear previous data
        jobData.jobs.forEach(job => {
            const li = document.createElement('li');
            li.textContent = job.title;
            jobsList.appendChild(li);
        });

        // Populate Cities
        const citiesList = document.getElementById('cities-list');
        citiesList.innerHTML = '';
        jobData.cities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            citiesList.appendChild(li);
        });

        // Populate Companies
        const companiesList = document.getElementById('companies-list');
        companiesList.innerHTML = '';
        jobData.companies.forEach(company => {
            const li = document.createElement('li');
            li.textContent = company;
            companiesList.appendChild(li);
        });
    }
}

// Simulated job data fetching function (replace with actual API calls)
async function getJobDataByCountry(country) {
    const mockData = {
        jobs: [
            { title: 'Software Engineer' },
            { title: 'Data Scientist' },
            { title: 'Product Manager' }
        ],
        cities: ['New York', 'San Francisco', 'Los Angeles'],
        companies: ['Google', 'Facebook', 'Amazon']
    };

    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => resolve(mockData), 500);
    });
}

// Fetch countries when the page loads
document.addEventListener('DOMContentLoaded', fetchCountries);

