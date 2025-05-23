
const jobListingsContainer = document.getElementById("jobListings");
const filterBar = document.getElementById("filterBar");
const filterTags = document.getElementById("filterTags");
const clearBtn = document.getElementById("clearBtn");

let jobsData = [];
let selectedFilters = [];


async function fetchJobs() {
  try {
    const response = await fetch("./data.json");
    jobsData = await response.json();
    renderJobs(jobsData);
  } catch (error) {
    console.error("Error fetching job data:", error);
  }
}


function renderJobs(jobs) {
  jobListingsContainer.innerHTML = ""; 

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    if (job.featured) jobCard.classList.add("featured");

  
    const jobHeader = document.createElement("div");
    jobHeader.classList.add("job-header");

    const logo = document.createElement("img");
    logo.src = job.logo;
    logo.alt = `${job.company} Logo`;

    const jobInfo = document.createElement("div");
    jobInfo.classList.add("job-info");

    const companyTags = document.createElement("div");
    companyTags.classList.add("company-tags");

    const company = document.createElement("span");
    company.classList.add("company");
    company.textContent = job.company;

    companyTags.appendChild(company);
    if (job.new) {
      const newTag = document.createElement("span");
      newTag.classList.add("tag", "new");
      newTag.textContent = "NEW!";
      companyTags.appendChild(newTag);
    }
    if (job.featured) {
      const featuredTag = document.createElement("span");
      featuredTag.classList.add("tag", "featured");
      featuredTag.textContent = "FEATURED";
      companyTags.appendChild(featuredTag);
    }

    const position = document.createElement("h2");
    position.classList.add("position");
    position.textContent = job.position;

    const jobMeta = document.createElement("div");
    jobMeta.classList.add("job-meta");
    jobMeta.innerHTML = `<span>${job.postedAt}</span>  <span>${job.contract}</span>  <span>${job.location}</span>`;

    jobInfo.appendChild(companyTags);
    jobInfo.appendChild(position);
    jobInfo.appendChild(jobMeta);

    jobHeader.appendChild(logo);
    jobHeader.appendChild(jobInfo);

    const jobTags = document.createElement("div");
    jobTags.classList.add("job-tags");

    const tags = [job.role, job.level, ...job.languages, ...job.tools];
    tags.forEach((tag) => {
      const tagBtn = document.createElement("button");
      tagBtn.classList.add("tag", "filter-tag");
      tagBtn.textContent = tag;
      jobTags.appendChild(tagBtn);
    });

   
    jobCard.appendChild(jobHeader);
    jobCard.appendChild(jobTags);
    jobListingsContainer.appendChild(jobCard);
  });

 
  addFilterListeners();
}


function addFilterListeners() {
  document.querySelectorAll(".filter-tag").forEach((tag) => {
 
    tag.removeEventListener("click", handleFilterClick); 
    tag.addEventListener("click", handleFilterClick);
  });
}


function handleFilterClick(e) {
  const filter = e.target.textContent;
  if (!selectedFilters.includes(filter)) {
    selectedFilters.push(filter);
    updateFilterBar();
    filterJobs();
  }
}


function updateFilterBar() {
  filterTags.innerHTML = "";
  selectedFilters.forEach((filter) => {
    const tag = document.createElement("div");
    tag.classList.add("filter-tag");
    tag.innerHTML = `<span>${filter}</span><button>X</button>`;
    filterTags.appendChild(tag);
  });


  if (selectedFilters.length > 0) {
    filterBar.style.display = "flex";
  } else {
    filterBar.style.display = "none";
  }
}


function filterJobs() {
  const filteredJobs = jobsData.filter((job) => {
    const jobCategories = [job.role, job.level, ...job.languages, ...job.tools];
  
    return selectedFilters.every((filter) =>
      jobCategories.some((category) => category.toLowerCase() === filter.toLowerCase())
    );
  });

  renderJobs(filteredJobs);
}

filterTags.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const filter = e.target.parentElement.textContent.trim().split(" ")[0];
    selectedFilters = selectedFilters.filter((f) => f !== filter);
    updateFilterBar();
    filterJobs();
  }
});


clearBtn.addEventListener("click", () => {
  selectedFilters = [];
  updateFilterBar();
  filterJobs();
});


fetchJobs();