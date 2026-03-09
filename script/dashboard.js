const issuesNo = document.getElementById("issues-no");

const fetchIssues = async (type = "all") => {
  manageSpinner(true);
  try {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const res = await fetch(url);
    const details = await res.json();
    const obj = details.data;
    setActiveFilter(type);
    displayIssues(obj, type);

  } catch (error) {
    console.error("Error fetching issues:", error);
  };
};

const setActiveFilter = (type) => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    if (filter.classList.contains("active")) {
      filter.classList.remove("active");
    };
    if (filter.dataset.type === type) {
      filter.classList.add("active");
    };
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchIssues();
});

const openIssue = (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

  fetch(url)
    .then(res => res.json())
    .then(json => displayIssue(json.data));
};

const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const displayIssue = (issue) => {

  const modal = document.createElement("dialog");
  modal.className = "w-full md:w-[700px] h-fit md:max-h-[440px] shadow-md rounded-box space-y-1 p-4 m-auto";
  modal.id = "issue_modal";

  const statusColor =
    issue.status === "open" ? "bg-green-600" : "bg-orange-600";

  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-orange-500",
    low: "bg-gray-500"
  };

  modal.innerHTML = `
        <div class="flex flex-col gap-1 px-4">
            <h1 class="font-bold text-[#1F2937] text-[18px] md:text-[24px]">
                ${issue.title}
            </h1>

            <div class="flex justify-start gap-2 items-center  text-[#64748B]">
                <button
                    class="btn btn-outline border-none ${statusColor} rounded-full py-2 px-3 w-fit h-8 text-white font-medium text-[12px]">
                    ${capitalize(issue.status)}
                </button>
                •
                <div class="text-[12px] md:text-[14px]">
                    Opened by <span class="assignee">${issue.assignee ? issue.assignee : "Not mentioned"}</span>
                </div>
                •
                <div class="date text-[12px] md:text-[14px]">
                     ${new Date(issue.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}
                </div>
            </div>
        </div>

        <div class="space-y-3 p-4 text-[#64748B] text-[16px]">

            <div class="labels flex flex-wrap items-center gap-2"></div>

            <p class="text-[16px] text-[#64748B]">
                ${issue.description}
            </p>
        </div>

        <div class="w-full bg-gray-100 text-[16px] text-[#64748B] flex justify-between p-4 rounded-box">
            <div class="w-1/2">
                <p>Assignee:</p>
                <span class="assignee font-semibold text-[#1F2937]">
                    ${issue.assignee ? issue.assignee : "Not mentioned"}
                </span>
            </div>

            <div class="w-1/2">
                <p>Priority:</p>
                <button
                    class="btn btn-outline border-none ${priorityColor[issue.priority]} rounded-full py-2 px-3 w-fit h-8 text-white font-medium text-[12px]">
                    ${issue.priority.toUpperCase()}
                </button>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-primary">Close</button>
            </form>
        </div>
  `;

  document.body.appendChild(modal);

  // render labels
  const labelsContainer = modal.querySelector(".labels");
  loadLabels(issue.labels, labelsContainer);

  modal.showModal();
};

// Function to render labels into a given container
const loadLabels = (labels, container) => {
  container.innerHTML = "";

  labels.forEach(label => {
    const config = labelStyles[label];
    if (!config) return;

    const btn = document.createElement("button");
    btn.className = config.classes;
    btn.innerHTML = `<i class="${config.icon}"></i> ${label.toUpperCase()}`;

    container.appendChild(btn);
  });
};

// Label configuration for dynamic rendering
const labelStyles = {
  bug: {
    icon: "fa-solid fa-bug",
    classes: "btn btn-outline bg-red-100 border-2 border-red-200 rounded-full p-2 w-19 h-8 text-red-600 font-medium text-[12px]"
  },
  "help wanted": {
    icon: "fa-brands fa-chrome",
    classes: "btn btn-outline bg-orange-100 border-2 border-orange-200 rounded-full p-2 w-fit h-8 text-orange-600 font-medium text-[12px]"
  },
  enhancement: {
    icon: "fa-solid fa-star-half-stroke",
    classes: "btn btn-outline bg-green-100 border-2 border-green-200 rounded-full p-2 w-fit h-8 text-green-600 font-medium text-[12px]"
  },
  "good first issue": {
    icon: "fa-solid fa-star",
    classes: "btn btn-outline bg-yellow-100 border-2 border-yellow-200 rounded-full p-2 w-fit h-8 text-yellow-600 font-medium text-[12px]"
  },
  documentation: {
    icon: "fa-solid fa-file",
    classes: "btn btn-outline bg-blue-100 border-2 border-blue-200 rounded-full p-2 w-fit h-8 text-blue-600 font-medium text-[12px]"
  }
};

// Function to display issues
const displayIssues = (issues, type) => {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear previous cards
  issuesCount = 0;

  issues.forEach(issue => {

    if ((type == "open" || type == "closed") && type !== issue.status) {
      return;
    };

    const card = document.createElement("div");
    card.className = `card ${issue.status} mx-auto w-full md:w-[256px] h-auto shadow-md rounded-box space-y-4`;
    card.setAttribute("onclick", `openIssue(${issue.id})`);

    card.innerHTML = `
      <div class="space-y-3 p-4 border-b border-gray-300">

        <div class="flex justify-between items-center">

          <div class="w-6 h-6 flex items-center rounded-full">
            <img src="${issue.status === 'open' ? 'assets/Open-Status.png' : 'assets/Closed-Status.png'}" alt="">
          </div>

          <button class="${issue.priority === "high"
        ? 'btn btn-outline border-none bg-red-100 btn-error rounded-full p-2 w-20 h-7 text-red-600 font-medium text-[12px]'
        : issue.priority === "medium"
          ? 'btn btn-outline border-none bg-orange-100 rounded-full p-2 w-20 h-7 text-orange-600 font-medium text-[12px]'
          : 'btn btn-outline border-none bg-gray-200 rounded-full p-2 w-20 h-7 text-gray-600 font-medium text-[12px]'
      }">
            ${issue.priority.toUpperCase()}
          </button>

        </div>

        <div>
          <h1 class="font-semibold text-[#1F2937] text-[14px]">
            ${issue.title}
          </h1>
          <p class="text-[12px] text-[#64748B]">
            ${issue.description}
          </p>
        </div>

        <div class="labels flex flex-wrap items-center gap-2"></div>

      </div>

      <div class="text-[12px] text-[#64748B] items-center px-4 pb-4">
        <div>
          # <span>${issue.id}</span>
          by <span class="author">${issue.author ? issue.author : "Not mentioned"}</span>
        </div>
        <div class="date">
          ${new Date(issue.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}
        </div>
      </div>
    `;

    // Render labels into the correct container
    const labelsContainer = card.querySelector(".labels");
    loadLabels(issue.labels, labelsContainer);

    container.appendChild(card);
    issuesCount++;
  });
  manageSpinner(false);
  issuesNo.innerText = `${issuesCount}`;
};

// search
document.getElementById("search-btn").addEventListener("click", () => {
  manageSpinner(true);
  const searchText = document.getElementById("search-input").value.trim().toLowerCase();
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const obj = data.data;
      displayIssues(obj);
      setActiveFilter();
    })
});

// nav on small devices
const navBtn = document.getElementById("nav-toggle-btn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("nav-overlay");

navBtn.addEventListener("click", () => {
  nav.classList.toggle("translate-x-full");
  overlay.classList.remove("hidden");
});

overlay.addEventListener("click", () => {
  nav.classList.add("translate-x-full");   // slide nav out
  overlay.classList.add("hidden");
});

// spinner
const manageSpinner = (status) =>{
    if(status==true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("card-container").classList.add("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("card-container").classList.remove("hidden");
    }
}