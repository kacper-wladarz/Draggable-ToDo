import { useState } from "react";
import { useCreateProject } from "../../../Tanstack/Project/ProjectMutations";

const NewProject = () => {
    const [newProject, setNewProject] = useState<NewProject>({ name: "" });
    const createProject = useCreateProject();

    const handleCreateProject = () => {
        createProject.mutate(newProject, {
            onSuccess: (res) => console.log(res),
            onError: (err) => console.log(err),
        });
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(event) =>
                    setNewProject((prev) => ({
                        ...prev,
                        name: event.target.value,
                    }))
                }
            />
            <button onClick={handleCreateProject}>Create</button>
        </div>
    );
};

export default NewProject;
