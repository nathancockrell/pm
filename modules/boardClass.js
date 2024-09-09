export default class Board {
    constructor(projects, loginKey, saveData){
        this.sections = ['stall', 'todo', 'doing', 'done'];
        this.projects = projects;
        this.loginKey=loginKey;
        this.currentProjectId = null;
        this.saveData=saveData;

        document.getElementById('add-project-btn').addEventListener('click', this.addProject.bind(this));
        this.renderProjects();

    }
        renderProjects() {
            this.sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                section.innerHTML=''
                // section.innerHTML = `<h2>${capitalize(sectionId)}</h2>`;
                Object.entries(this.projects).forEach(([id, project]) => {
                    if (project.section === sectionId) {
                        
                        const projectDiv = document.createElement('div');
                        projectDiv.className = 'project';
                        projectDiv.innerHTML = `
                            <p class="project-name">${project.name}</p>
                            <button class="move-btn">⋮</button>
                        `;
                        projectDiv.querySelector('.move-btn').addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.manageProject(id);
                        });
                        projectDiv.addEventListener('click', () => this.showProjectDetails(id));
                        section.appendChild(projectDiv);
                    }
                });
            });
        }
    
        addProject() {
            const name = prompt('Enter project name:');
            if (name) {
                const id = Date.now().toString();
                console.log(this.projects)
                this.projects[id] = { name, section: 'stall', resources: [], issues: [] };
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
                this.renderProjects();
            }
        }
    
        manageProject(id) {
            const input = prompt("Enter name of new section OR 'delete'");
            if (this.sections.includes(input)) {
                this.projects[id].section = input;
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
                this.renderProjects();
            }else if(input=="delete"){
                Reflect.deleteProperty(this.projects,id);
                this.saveData(this.loginKey, this.projects)
                this.renderProjects();
            } else {
                // alert('Invalid section name.');
            }
        }
    
        showProjectDetails(id) {
            const sects = document.querySelectorAll(".project-section")
                sects.forEach((sect)=>{
                    sect.classList.add("hide-overflow")
                })
            document.querySelector("body").classList.add("hide-overflow")
            this.currentProjectId = id;
            const project = this.projects[id];
            const modal = document.getElementById('project-modal');
            document.getElementById('project-name').textContent = project.name;
            document.getElementById('resource-list').innerHTML = project.resources.map(resource => `<li>${resource}</li>`).join('');
            this.updateIssueSections();
    
            modal.style.display = 'flex';
    
            document.querySelector('.close-btn').onclick = () => {
                const sects = document.querySelectorAll(".project-section")
                sects.forEach((sect)=>{
                    sect.classList.remove("hide-overflow")
                })
                document.querySelector("body").classList.remove("hide-overflow")
                modal.style.display = 'none';
            };
    
            document.getElementById('add-resource-btn').onclick = () => this.addResource();
            document.getElementById('add-issue-btn').onclick = () => this.addIssue();
        }
    
        addResource() {
            const resource = document.getElementById('resource-textarea').value.trim();
            if (resource) {
                this.projects[this.currentProjectId].resources.push(resource);
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
                document.getElementById('resource-textarea').value = '';
                this.showProjectDetails(this.currentProjectId);  // Refresh the project details
            }
        }
    
        addIssue() {
            const name = prompt('Enter issue name:');
            if (name) {
                const id = Date.now().toString();
                this.projects[this.currentProjectId].issues.push({
                    id,
                    name,
                    description: '',
                    section: 'stall',
                    date: new Date().toISOString(),
                    history: []
                });
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
                this.showProjectDetails(this.currentProjectId);  // Refresh the project details
            }
        }
    
        updateIssueSections() {
            this.sections.forEach(sectionId => {
                const section = document.getElementById(`${sectionId}-issues`);
                section.innerHTML = `<h4>${sectionId}</h4>`;
                this.projects[this.currentProjectId].issues.forEach(issue => {
                    if (issue.section === sectionId) {
                        const issueDiv = document.createElement('div');
                        issueDiv.className = 'issue';
                        issueDiv.innerHTML = `
                            ${issue.name}
                            <button class="move-issue-btn">⋮</button>
                        `;
                        issueDiv.querySelector('.move-issue-btn').addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.manageIssue(issue.id);
                        });
                        issueDiv.addEventListener('click', () => this.showIssueDetails(issue.id));
                        section.appendChild(issueDiv);
                    }
                });
            });
        }
    
        manageIssue(id) {
            const newSection = prompt("Enter name of new section OR 'delete'");
            if (this.sections.includes(newSection)) {
                const issue = this.projects[this.currentProjectId].issues.find(issue => issue.id === id);
                issue.section = newSection;
                issue.history.push({
                    section: issue.section,
                    date: new Date().toISOString()
                });
                
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
                this.showProjectDetails(this.currentProjectId);  // Refresh the project details
            }else if(newSection=="delete"){
                const issue = this.projects[this.currentProjectId].issues.find(issue => issue.id === id);
                this.projects[this.currentProjectId].issues=this.projects[this.currentProjectId].issues.filter((iss) =>iss.name!==issue.name)
                this.saveData(this.loginKey, this.projects);
                this.showProjectDetails(this.currentProjectId);
                
            }   
            else {
                // alert('Invalid section name.');
            }
        }
    
        showIssueDetails(id) {
            const sects = document.querySelectorAll(".issue-section");
                sects.forEach((sect)=>{
                    sect.classList.add("hide-overflow")
                })
            document.getElementById("project-modal").classList.add("hide-overflow");
            const issue = this.projects[this.currentProjectId].issues.find(issue => issue.id === id);
            const modal = document.getElementById('issue-modal');
            document.getElementById('issue-name').textContent = issue.name;
            document.getElementById('issue-date').textContent = issue.date.slice(0,19)
    
            const descriptionTextarea = document.getElementById('issue-description');
            descriptionTextarea.value = issue.description;
    
            descriptionTextarea.addEventListener('input', () => {
                issue.description = descriptionTextarea.value;
                // localStorage.setItem('projects', JSON.stringify(projects));
                this.saveData(this.loginKey, this.projects);
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

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}