// Import Firebase and Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_LXeId89txDwnvZuEeFBzC1rkgZB3bbY",
    authDomain: "projectm-894b9.firebaseapp.com",
    projectId: "projectm-894b9",
    storageBucket: "projectm-894b9.appspot.com",
    messagingSenderId: "467678578464",
    appId: "1:467678578464:web:a9ac1f80a868e17b8e3945",
    measurementId: "G-F5Q8CQ38NG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
let projects ={};

let loginKey = localStorage.getItem("loginKey") || "";

// Save data function
async function saveData(loginKey, data) {
    try {
      // Ensure that `loginKey` is a valid document ID
      if (!loginKey) {
        localStorage.setItem('projects', JSON.stringify(projects));
        throw new Error("Invalid loginKey");
      }
      await setDoc(doc(db, "users", loginKey), {
        toolsData: data
      });
      console.log("Autosaved to current loginkey");
    } catch (e) {
      console.log("Error writing document: ", e);
    }
  }
  
  // Load data function
  async function loadData(loginKey) {
    if (!loginKey) {
        // let projects = JSON.parse(localStorage.getItem('projects')) || {};
      console.log("Invalid loginKey");
      return;
    }
    const docRef = doc(db, "users", loginKey);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data().toolsData;
    } else {
      console.log("No such document!");
    }
  }

  async function loadPage(loginKey){
    if (!loginKey) {
        // Get the projects from localStorage, ensuring it contains valid JSON data
        const localData = localStorage.getItem('projects');
        if (localData) {
            try {
                projects = JSON.parse(localData);
            } catch (e) {
                console.error("Error parsing local storage data: ", e);
                projects = {}; // fallback to empty object if parsing fails
            }
        } else {
            projects = {}; // initialize projects as an empty object if no data is found
        }
        console.log("loaded with localstorage");
    }else {
        projects = await loadData(loginKey) || {};
        console.log("loaded with firebase")
    }
  }


document.addEventListener('DOMContentLoaded', async () => {

    

    const sections = ['stall', 'future', 'present', 'past'];
    
    if(!loginKey){
        console.log(true)
    }else{
        console.log(false);
    }
    await loadPage(loginKey);
    let currentProjectId = null;

    document.getElementById("save-key").addEventListener("click", ()=>{
        loginKey = prompt("Enter load key");
        localStorage.setItem("loginKey", loginKey)
    })
    document.getElementById("new-save").addEventListener("click", ()=>{
        let pass = prompt("Warning: This will reset all unsaved progress. To preserve it, save it to a login key. Type 'yes' to reset.")
        if(pass === "yes"){
            localStorage.setItem('projects', "");
            loginKey="";
            localStorage.setItem("loginKey","")
            loadPage(loginKey);
            location.reload();
        }
        else{
            return;
        }
    })
    document.getElementById("view-key").addEventListener("click", function(){
        if(loginKey){
            alert("Current login key: "+loginKey);
        } else{
            alert("No current load key. Data is stored to device browser.")
        }  
    })
    document.getElementById("change-key").addEventListener("click", function(){
        const temp = prompt("Enter load key");
        if(temp){
            loginKey=temp;
            loadData(loginKey);
        }
    })
    
    function renderProjects() {
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            // section.innerHTML = `<h2>${capitalize(sectionId)}</h2>`;
            Object.entries(projects).forEach(([id, project]) => {
                if (project.section === sectionId) {
                    const projectDiv = document.createElement('div');
                    projectDiv.className = 'project';
                    projectDiv.innerHTML = `
                        <p class="project-name">${project.name}</p>
                        <button class="move-btn">Move</button>
                    `;
                    projectDiv.querySelector('.move-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        moveProject(id);
                    });
                    projectDiv.addEventListener('click', () => showProjectDetails(id));
                    section.appendChild(projectDiv);
                }
            });
        });
    }

    function addProject() {
        const name = prompt('Enter project name:');
        if (name) {
            const id = Date.now().toString();
            projects[id] = { name, section: 'stall', resources: [], issues: [] };
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            renderProjects();
        }
    }

    function moveProject(id) {
        const newSection = prompt('Enter new section (stall, future, present, past):');
        if (sections.includes(newSection)) {
            projects[id].section = newSection;
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            renderProjects();
        } else {
            alert('Invalid section name.');
        }
    }

    function showProjectDetails(id) {
        currentProjectId = id;
        const project = projects[id];
        const modal = document.getElementById('project-modal');
        document.getElementById('project-name').textContent = project.name;
        document.getElementById('resource-list').innerHTML = project.resources.map(resource => `<li>${resource}</li>`).join('');
        updateIssueSections();

        modal.style.display = 'block';

        document.querySelector('.close-btn').onclick = () => {
            modal.style.display = 'none';
        };

        document.getElementById('add-resource-btn').onclick = () => addResource();
        document.getElementById('add-issue-btn').onclick = () => addIssue();
    }

    function addResource() {
        const resource = document.getElementById('resource-textarea').value.trim();
        if (resource) {
            projects[currentProjectId].resources.push(resource);
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            document.getElementById('resource-textarea').value = '';
            showProjectDetails(currentProjectId);  // Refresh the project details
        }
    }

    function addIssue() {
        const name = prompt('Enter issue name:');
        if (name) {
            const id = Date.now().toString();
            projects[currentProjectId].issues.push({
                id,
                name,
                description: '',
                section: 'stall',
                date: new Date().toISOString(),
                history: []
            });
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            showProjectDetails(currentProjectId);  // Refresh the project details
        }
    }

    function updateIssueSections() {
        sections.forEach(sectionId => {
            const section = document.getElementById(`${sectionId}-issues`);
            section.innerHTML = `<h4>${capitalize(sectionId)}</h4>`;
            projects[currentProjectId].issues.forEach(issue => {
                if (issue.section === sectionId) {
                    const issueDiv = document.createElement('div');
                    issueDiv.className = 'issue';
                    issueDiv.innerHTML = `
                        ${issue.name}
                        <button class="move-issue-btn">Move</button>
                    `;
                    issueDiv.querySelector('.move-issue-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        moveIssue(issue.id);
                    });
                    issueDiv.addEventListener('click', () => showIssueDetails(issue.id));
                    section.appendChild(issueDiv);
                }
            });
        });
    }

    function moveIssue(id) {
        const newSection = prompt('Enter new section (stall, future, present, past):');
        if (sections.includes(newSection)) {
            const issue = projects[currentProjectId].issues.find(issue => issue.id === id);
            issue.section = newSection;
            issue.history.push({
                section: issue.section,
                date: new Date().toISOString()
            });
            
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            showProjectDetails(currentProjectId);  // Refresh the project details
        } else {
            alert('Invalid section name.');
        }
    }

    function showIssueDetails(id) {
        const issue = projects[currentProjectId].issues.find(issue => issue.id === id);
        const modal = document.getElementById('issue-modal');
        document.getElementById('issue-name').textContent = issue.name;
        const descriptionTextarea = document.getElementById('issue-description');
        descriptionTextarea.value = issue.description;

        descriptionTextarea.addEventListener('input', () => {
            issue.description = descriptionTextarea.value;
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
        });

        modal.style.display = 'block';

        document.querySelector('.close-issue').onclick = () => {
            modal.style.display = 'none';
        };
    }

    document.getElementById('add-project-btn').addEventListener('click', addProject);
    renderProjects();
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

