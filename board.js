// Import Firebase and Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


console.log(window.location.href)
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

let queryURL=window.location.search;
queryURL=queryURL.slice(1);
queryURL=atob(queryURL)
const URLParams = new URLSearchParams(queryURL)

let loginKey = URLParams.get("key") || "";
if(loginKey==""){
    window.location.href="./"
}

// Save data function
async function saveData(loginKey, data) {
    try {
      // Ensure that `loginKey` is a valid document ID
      if (!loginKey) {
        
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



document.addEventListener('DOMContentLoaded', async () => {
    const sections = ['stall', 'future', 'present', 'past'];
    
    if(!loginKey){
        console.log(true)
    }else{
        console.log(false);
    }
    projects = await loadData(loginKey) || {};
    let currentProjectId = null;

    document.getElementById("view-key").addEventListener("click", function(){
        if(loginKey){
            alert("Current login key: "+loginKey);
        } else{
            alert("No current load key. Data is stored to device browser.")
        }  
    })
    document.getElementById("load-key").addEventListener("click", function(){
        const key = prompt("Enter your login key, or a new one.");
    if(key){
        const params = new URLSearchParams();
        params.append('key', key);
        const queryString = params.toString();
        // btoa(queryString)
        window.location.href=`./board.html?${btoa(queryString)}`
    }else{
        // alert("no key entered")
    }
    });
    document.getElementById("use-guest").addEventListener("click", ()=>{
        window.location.href="./guest.html"
    })

    
    function renderProjects() {
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            section.innerHTML=''
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

