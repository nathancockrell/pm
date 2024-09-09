
document.addEventListener('DOMContentLoaded', async () => {
    
    const sections = ['stall', 'future', 'present', 'past'];
    
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
                        <button class="move-btn">⋮</button>
                    `;
                    projectDiv.querySelector('.move-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        manageProject(id);
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

    function manageProject(id) {
        const input = prompt("Enter new section (stall, future, present, past) OR 'delete'");
        if (sections.includes(input)) {
            projects[id].section = input;
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
            renderProjects();
        }else if(input=="delete"){
            Reflect.deleteProperty(projects,id);
            saveData(loginKey, projects)
            renderProjects();
        } else {
            // alert('Invalid section name.');
        }
    }

    function showProjectDetails(id) {
        const sects = document.querySelectorAll(".project-section")
            sects.forEach((sect)=>{
                sect.classList.add("hide-overflow")
            })
        currentProjectId = id;
        const project = projects[id];
        const modal = document.getElementById('project-modal');
        document.getElementById('project-name').textContent = project.name;
        document.getElementById('resource-list').innerHTML = project.resources.map(resource => `<li>${resource}</li>`).join('');
        updateIssueSections();

        modal.style.display = 'flex';

        document.querySelector('.close-btn').onclick = () => {
            const sects = document.querySelectorAll(".project-section")
            sects.forEach((sect)=>{
                sect.classList.remove("hide-overflow")
            })
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
                        <button class="move-issue-btn">⋮</button>
                    `;
                    issueDiv.querySelector('.move-issue-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        manageIssue(issue.id);
                    });
                    issueDiv.addEventListener('click', () => showIssueDetails(issue.id));
                    section.appendChild(issueDiv);
                }
            });
        });
    }

    function manageIssue(id) {
        const newSection = prompt("Enter new section (stall, future, present, past) OR 'delete'");
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
        }else if(newSection=="delete"){
            const issue = projects[currentProjectId].issues.find(issue => issue.id === id);
            projects[currentProjectId].issues=projects[currentProjectId].issues.filter((iss) =>iss.name!==issue.name)
            saveData(loginKey, projects);
            showProjectDetails(currentProjectId);
            
        }   
        else {
            // alert('Invalid section name.');
        }
    }

    function showIssueDetails(id) {
        const sects = document.querySelectorAll(".issue-section");
            sects.forEach((sect)=>{
                sect.classList.add("hide-overflow")
            })
        document.getElementById("project-modal").classList.add("hide-overflow");
        const issue = projects[currentProjectId].issues.find(issue => issue.id === id);
        const modal = document.getElementById('issue-modal');
        document.getElementById('issue-name').textContent = issue.name;
        document.getElementById('issue-date').textContent = issue.date.slice(0,19)
        const descriptionTextarea = document.getElementById('issue-description');
        descriptionTextarea.value = issue.description;

        descriptionTextarea.addEventListener('input', () => {
            issue.description = descriptionTextarea.value;
            // localStorage.setItem('projects', JSON.stringify(projects));
            saveData(loginKey, projects);
        });

        modal.style.display = 'flex';

        document.querySelector('.close-issue').onclick = () => {
            modal.style.display = 'none';
            const sects = document.querySelectorAll(".issue-section");
            sects.forEach((sect)=>{
                sect.classList.remove("hide-overflow")
            })
            document.getElementById("project-modal").classList.remove("hide-overflow");
        };
    }

    document.getElementById('add-project-btn').addEventListener('click', addProject);
    renderProjects();
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}