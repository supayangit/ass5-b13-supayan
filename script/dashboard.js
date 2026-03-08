const fetchIssues = async (type="all") => {
    try {
        const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
        const res = await fetch(url);
        const details = await res.json();
        const obj = details.data;
        console.log(obj);

        setActiveFilter(type);
        displayIssues(obj, type);

      } catch (error) {
        console.error("Error fetching issues:", error);
    }
};

const setActiveFilter = (type) => {
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    if(filter.classList.contains("active")){
      filter.classList.remove("active");
    };
    if(filter.dataset.type === type){
      filter.classList.add("active");
    };
  });
};

document.addEventListener("DOMContentLoaded", () => {
    fetchIssues();
});

/**
 {
"id": 1,
"title": "Fix navigation menu on mobile devices",
"description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
"status": "open",
"labels": [
"bug",
"help wanted"
],
"priority": "high",
"author": "john_doe",
"assignee": "jane_smith",
"createdAt": "2024-01-15T10:30:00Z",
"updatedAt": "2024-01-15T10:30:00Z"
},
 */

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

// Function to render labels into a given container
const loadLabels = (labels, container) => {
  container.innerHTML = ""; // Clear previous labels

  labels.forEach(label => {
    const config = labelStyles[label];
    if (!config) return; // Skip unknown labels

    const btn = document.createElement("button");
    btn.className = config.classes;
    btn.innerHTML = `<i class="${config.icon}"></i> ${label.toUpperCase()}`;

    container.appendChild(btn);
  });
};

// Function to display issues
const displayIssues = (issues, type) => {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear previous cards

  issues.forEach(issue => {

    if((type == "open" || type == "closed") && type!==issue.status) {
    return;
    };

    const card = document.createElement("div");
    card.className = `card ${issue.status} w-[256px] h-auto shadow-md rounded-box space-y-4`;

    card.innerHTML = `
      <div class="space-y-3 p-4 border-b border-gray-300">

        <div class="flex justify-between items-center">

          <div class="w-6 h-6 flex items-center rounded-full">
            <img src="${issue.status === 'open' ? 'assets/Open-Status.png' : 'assets/Closed-Status.png'}" alt="">
          </div>

          <button class="${
            issue.priority === "high"
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
          by <span class="author">${issue.author}</span>
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
  });
};