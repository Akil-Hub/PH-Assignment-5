// initial selection
let currentTab = "all";
const tabActive = ["text-white", "font-bold", "btn-primary"];
const tabInactive = ["bg-gray-200", "text-black"];
const nameInput = document.getElementById("nameInput");
const passInput = document.getElementById("passInput");
const login = document.getElementById("login");
const loginForm = document.getElementById("loginForm");
const mainContainer = document.getElementById("mainContainer");
const issueContainer = document.getElementById("issueContainer");
const openContainer = document.getElementById("openContainer");
const closedContainer = document.getElementById("closedContainer");
const dynamicIssue = document.getElementById("dynamicIssue");
const searchBtn = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const allIssuesContainer = document.getElementById("allIssuesContainer");
const notFound = document.getElementById("notFound");

// login page functionality

login.addEventListener("click", () => {
  if (nameInput.value != "admin" || passInput.value != "admin123") {
    alert("Invalid Credentials");
  } else {
    loginForm.classList.add("hidden");
    mainContainer.classList.remove("hidden");
  }
});

// toggle tabs

// initial all issues load
issueContainer.classList.remove("hidden");

const toggleTabs = (tab) => {
  const tabs = ["all", "open", "closed"];
  currentTab = tab;

  for (const t of tabs) {
    const tabName = document.getElementById("tab-" + t);

    if (tab === t) {
      tabName.classList.remove(...tabInactive);
      tabName.classList.add(...tabActive);
    } else {
      tabName.classList.remove(...tabActive);
      tabName.classList.add(...tabInactive);
    }
  }
  // initial remove not found page
  notFound.classList.add("hidden");

  const pages = [issueContainer, openContainer, closedContainer];

  for (const page of pages) {
    page.classList.add("hidden");
  }

  if (tab === "all") {
    issueContainer.classList.remove("hidden");
    dynamicIssue.innerText = 50;
    notFound.classList.add("hidden");
  } else if (tab === "open") {
    openContainer.classList.remove("hidden");
    dynamicIssue.innerText = 44;
    notFound.classList.add("hidden");
  } else if (tab === "closed") {
    closedContainer.classList.remove("hidden");
    dynamicIssue.innerText = 6;
    notFound.classList.add("hidden");
  }
};

// show and hide spinner
const loader = document.getElementById("loader");

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

// Load the issues from api

const loadIssues = async (params) => {
  showLoader();
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  const res = await fetch(url);
  const data = await res.json();
  hideLoader();
  displayIssues(data.data);
  displayOpenIssues(data.data);
  displayClosedIssues(data.data);
};

// formated date
const formatDate = (d) => new Date(d).toLocaleDateString();

// load single issue
const loadIssueDetails = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const issue = data.data;

  showModal(issue);
};

// show modal
function showModal(issue) {
  document.getElementById("modalTitle").innerText = issue.title;
  document.getElementById("modalDescription").innerText = issue.description;

  document.getElementById("modalAuthor").innerText = issue.author;
  document.getElementById("modalDate").innerText = formatDate(issue.createdAt);

  document.getElementById("modalAssignee").innerText =
    issue.assignee || 'Not Assigned'

  // Status
  const status1 = document.getElementById("modalStatus");
  status1.innerText = issue.status;

  status1.className =
    "px-3 py-1 rounded-full text-white font-semibold " +
    (issue.status === "open" ? "bg-green-500" : "bg-purple-500");

  // Priority
  const priorityl = document.getElementById("modalPriority");
  priorityl.innerText = issue.priority;

  priorityl.className =
    "px-3 py-1 rounded-full text-white font-semibold " +
    (issue.priority === "high"
      ? "bg-red-500"
      : issue.priority === "medium"
        ? "bg-yellow-500"
        : "bg-green-500");

  document.getElementById("issueModal").showModal();
}

// display all issues

const displayIssues = (issues) => {
  issues.forEach(
    ({
      id,
      title,
      description,
      status,
      priority,
      author,
      labels,
      assignee,
      updatedAt,
      createdAt,
    }) => {
      const issueCard = document.createElement("div");
      issueCard.innerHTML = `

<div class=" max-w-xl  mx-auto mt-6" >

  <!-- Card -->
  <div class="bg-base-100 shadow-md rounded-xl border border-gray-200 border-t-7 ${status === "open" ? "border-t-green-500" : "border-t-purple-500"} p-5" >

    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      
      <!-- Left Status -->
      <div class="flex items-center gap-2 text-green-600 font-semibold">
        <img src="${priority === "low" ? "./assets/Closed- Status .png" : "./assets/Open-Status.png"}" alt="">
      </div>

      <!-- Difficulty -->
      <span class="badge badge-outline badge-${priority === "high" ? "success" : priority === "medium" ? "warning" : "default"} font-bold ">${priority}</span>
    </div>

    <!-- Title -->
    <h2  class="text-xl font-bold mb-2 line-clamp-1">
      ${title}
    </h2>

    <!-- Description -->
    <div class="grid grid-cols-1 gap-2 text-gray-600 mb-4">
      <p class=" line-clamp-2">
        ${description}
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mb-4">

      <!-- Bug Button -->
      <button class="btn btn-soft btn-error btn-sm text-btn-error rounded-full font-semibold">
        <i class="fa-solid fa-bug mr-1"></i>
        ${labels[0] ? labels[0] : "No Bug"}
      </button>

      <!-- Help Needed Button -->
      <button class="btn btn-soft btn-warning btn-sm text-btn-warning font-bold rounded-full border">
        <i class="fa-solid fa-globe mr-1  border-amber-600"></i>
        ${labels[1] ? labels[1] : "Help Wanted"}
      </button>

    </div>

    <!-- Footer -->
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>#${author}</span>
      <span>${formatDate(createdAt)}</span>
    </div>
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>Assigned to ${assignee}</span>
      <span>${formatDate(updatedAt)}</span>
    </div>

  </div>
</div>
`;

      issueCard.addEventListener("click", () => {
        loadIssueDetails(id);
      });

      issueContainer.append(issueCard);
    },
  );
};
loadIssues();

// display open issues
const displayOpenIssues = (issues) => {
  const openIssues = issues.filter((issue) => issue.status === "open");

  openIssues.forEach(
    ({
      id,
      title,
      description,
      status,
      priority,
      author,
      labels,
      assignee,
      updatedAt,
      createdAt,
    }) => {
      const issueCard = document.createElement("div");
      issueCard.innerHTML = `

<div class="max-w-xl mx-auto mt-6">

  <!-- Card -->
  <div class="bg-base-100 shadow-md rounded-xl border border-gray-200 border-t-7 ${status === "open" ? "border-t-green-500" : "border-t-purple-500"} p-5">

    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      
      <!-- Left Status -->
      <div class="flex items-center gap-2 text-green-600 font-semibold">
        <img src="${priority === "low" ? "./assets/Closed- Status .png" : "./assets/Open-Status.png"}" alt="">
      </div>

      <!-- Difficulty -->
      <span class="badge badge-outline badge-${priority === "high" ? "success" : priority === "medium" ? "warning" : "default"} font-bold ">${priority}</span>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-2 line-clamp-1">
      ${title}
    </h2>

    <!-- Description -->
    <div class="grid grid-cols-1 gap-2 text-gray-600 mb-4">
      <p class='line-clamp-2'>
        ${description}
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mb-4">

      <!-- Bug Button -->
      <button class="btn btn-soft btn-error btn-sm text-btn-error rounded-full font-semibold">
        <i class="fa-solid fa-bug mr-1"></i>
        ${labels[0] ? labels[0] : "No Bug"}
      </button>

      <!-- Help Needed Button -->
      <button class="btn btn-soft btn-warning btn-sm text-btn-warning font-bold rounded-full border">
        <i class="fa-solid fa-globe mr-1  border-amber-600"></i>
        ${labels[1] ? labels[1] : "Help Wanted"}
      </button>

    </div>

    <!-- Footer -->
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>#${author}</span>
      <span>${formatDate(createdAt)}</span>
    </div>
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>Assigned to ${assignee}</span>
      <span>${formatDate(updatedAt)}</span>
    </div>

  </div>
</div>


`;
      issueCard.addEventListener("click", () => {
        loadIssueDetails(id);
      });

      openContainer.append(issueCard);
    },
  );
};

// display closed issues
function displayClosedIssues(issues) {
  const closedIssues = issues.filter((issue) => issue.status === "closed");

  closedIssues.forEach(
    ({
      id,
      title,
      description,
      status,
      priority,
      author,
      labels,
      assignee,
      updatedAt,
      createdAt,
    }) => {
      const issueCard = document.createElement("div");
      issueCard.innerHTML = `

<div class="max-w-xl mx-auto mt-6">

  <!-- Card -->
  <div class="bg-base-100 shadow-md rounded-xl border border-gray-200 border-t-7 ${status === "open" ? "border-t-green-500" : "border-t-purple-500"} p-5">

    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      
      <!-- Left Status -->
      <div class="flex items-center gap-2 text-green-600 font-semibold">
        <img src="${priority === "low" ? "./assets/Closed- Status .png" : "./assets/Open-Status.png"}" alt="">
      </div>

      <!-- Difficulty -->
      <span class="badge badge-outline badge-${priority === "high" ? "success" : priority === "medium" ? "warning" : "default"} font-bold ">${priority}</span>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-2 line-clamp-1">
      ${title}
    </h2>

    <!-- Description -->
    <div class="grid grid-cols-1 gap-2 text-gray-600 mb-4">
      <p  class='line-clamp-2'>
        ${description}
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mb-4">

      <!-- Bug Button -->
      <button class="btn btn-soft btn-error btn-sm text-btn-error rounded-full font-semibold">
        <i class="fa-solid fa-bug mr-1"></i>
        ${labels[0] ? labels[0] : "No Bug"}
      </button>

      <!-- Help Needed Button -->
      <button class="btn btn-soft btn-warning btn-sm text-btn-warning font-bold rounded-full border">
        <i class="fa-solid fa-globe mr-1  border-amber-600"></i>
        ${labels[1] ? labels[1] : "Help Wanted"}
      </button>

    </div>

    <!-- Footer -->
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>#${author}</span>
      <span>${formatDate(createdAt)}</span>
    </div>
    <div class="flex justify-between  gap-4 text-sm text-gray-500">
      <span>Assigned to ${assignee}</span>
      <span>${formatDate(updatedAt)}</span>
    </div>

  </div>
</div>


`;
      issueCard.addEventListener("click", () => {
        loadIssueDetails(id);
      });

      closedContainer.append(issueCard);
    },
  );
}

// search functionality is here
searchBtn.addEventListener("click", async () => {
  showLoader();

  const searchValue = searchInput.value.toLowerCase().trim();

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`;

  const res = await fetch(url);
  const data = await res.json();

  const issues = data.data;

  issueContainer.innerHTML = "";
  openContainer.classList.add("hidden");
  closedContainer.classList.add("hidden");
  issueContainer.classList.remove("hidden");

  hideLoader();

  if (issues.length === 0) {
    notFound.classList.remove("hidden");
  } else {
    notFound.classList.add("hidden");
    displayIssues(issues);
  }
});
