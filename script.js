document.addEventListener("DOMContentLoaded", () => {
    const jobListingsContainer = document.getElementById('job-listings');
    const filtersContainer = document.querySelector('.filters');
    const clearButton = document.getElementById('clear');
    let selectedFilters = new Set();
    let jobsData = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jobsData = data;  
            renderJobListings(data);
            setupFilters();
        });

    function renderJobListings(data) {
        jobListingsContainer.innerHTML = '';
        data.forEach(job => {
            if (shouldDisplayJob(job)) {
                const jobElement = document.createElement('div');
                jobElement.className = 'job-listing';
                jobElement.innerHTML = `
                    <div class="job-header">
                        <img src="${job.logo}" alt="${job.company}" class="company-logo">
                        <div class="job-info">
                            <div class="company-info">
                                <span class="company-name">${job.company}</span>
                                ${job.new ? '<span class="new-badge">NEW!</span>' : ''}
                                ${job.featured ? '<span class="featured-badge">FEATURED</span>' : ''}
                            </div>
                            <div class="job-title">${job.position}
                                <div class="tags">
                                    ${[job.role, job.level, ...job.languages, ...job.tools].map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                            <div class="job-details">
                                <span>${job.postedAt}</span>
                                <span>&middot;</span>
                                <span>${job.contract}</span>
                                <span>&middot;</span>
                                <span>${job.location}</span>
                            </div>
                        </div>
                    </div>
                `;
                jobListingsContainer.appendChild(jobElement);
            }
        });
    }

    function setupFilters() {
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter')) {
                const filterValue = e.target.textContent;
                if (selectedFilters.has(filterValue)) {
                    selectedFilters.delete(filterValue);
                    e.target.classList.remove('active');
                } else {
                    selectedFilters.add(filterValue);
                    e.target.classList.add('active');
                }
                renderJobListings(jobsData);  
            }
        });

        clearButton.addEventListener('click', () => {
            selectedFilters.clear();
            filtersContainer.querySelectorAll('.filter').forEach(tag => tag.classList.remove('active'));
            renderJobListings(jobsData);  
        });
    }

    function shouldDisplayJob(job) {
        if (selectedFilters.size === 0) return true;
        const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
        return [...selectedFilters].every(filter => jobTags.includes(filter));
    }
});
