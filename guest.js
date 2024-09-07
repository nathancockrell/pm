function saveData(projects) {
    
    localStorage.setItem('projects', JSON.stringify(projects));
}
document.addEventListener('DOMContentLoaded', async () => {

    let key = localStorage.getItem("saveKey") || "";
    console.log(key)
if(key){
    const params = new URLSearchParams();
    params.append('key', key);
    const queryString = params.toString();
    window.location.href=`./board.html?${btoa(queryString)}`
}

    const sections = ['stall', 'future', 'present', 'past'];

    const unprocessed = localStorage.getItem("projects")
    let projects
    if(unprocessed){
        projects = JSON.parse(unprocessed)
    }else{
        projects = {}
    }
    
    let currentProjectId = null;
    
    function renderProjects() {
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            section.innerHTML='';
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
            saveData(projects);
            renderProjects();
        }
    }

    function moveProject(id) {
        const newSection = prompt('Enter new section (stall, future, present, past):');
        if (sections.includes(newSection)) {
            projects[id].section = newSection;
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(projects);
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
            saveData(projects);
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
            saveData(projects);
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
            saveData(projects);
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
            saveData(projects);
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

