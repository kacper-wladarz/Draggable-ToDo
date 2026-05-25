import { useParams } from "react-router";

const SingleWorkspace = () => {
    const { workspaceUUID } = useParams();

    return <div>SingleWorkspace</div>;
};

export default SingleWorkspace;
