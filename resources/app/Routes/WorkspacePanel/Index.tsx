import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";

const Sortable = ({ task, index }) => {
    console.log(task, index);
    const { ref } = useSortable({ id: task.id, index });

    return (
        <div
            ref={ref}
            className="w-full bg-[#805802] rounded-md text-center text-white/70 text-3xl select-none py-1"
        >
            {task.task}
        </div>
    );
};

const Index = () => {
    const tasks1 = [
        { id: 1, task: "Task 1" },
        { id: 2, task: "Task 2" },
        { id: 3, task: "Task 3" },
    ];
    const tasks2 = [
        { id: 4, task: "Task 4" },
        { id: 5, task: "Task 5" },
    ];

    const tasks3 = [
        { id: 6, task: "Task 6" },
        { id: 7, task: "Task 7" },
    ];

    return (
        <div className="flex justify-center gap-x-10 p-10">
            <Column id={"ToDo"} key={"ToDo"}>
                {tasks1.map((task, index) => (
                    <Item
                        key={task.id}
                        task={task.task}
                        index={index}
                        column={"ToDo"}
                    />
                ))}
            </Column>
            <Column id={"InProgress"} key={"InProgress"}>
                {tasks2.map((task, index) => (
                    <Item
                        key={task.id}
                        task={task.task}
                        index={index}
                        column={"InProgress"}
                    />
                ))}
            </Column>
            {/* <div className="flex flex-col items-center gap-y-6 bg-[#151516] rounded-lg p-6 min-w-50 flex-1 max-w-100">
                <span className="text-5xl text-white font-light pb-2 truncate">
                    To do
                </span>
                <div className="flex flex-col gap-y-3 w-full">
                    {tasks1.map((task, index) => (
                        <Sortable key={task.id} task={task} index={index} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center gap-y-6 bg-[#151516] rounded-lg p-6 min-w-50 flex-1 max-w-100">
                <span className="w-full text-5xl text-white font-light pb-2 truncate">
                    In progress
                </span>
                <div className="flex flex-col gap-y-3 w-full">
                    {tasks2.map((task, index) => (
                        <Sortable key={task.id} task={task} index={index} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center gap-y-6 bg-[#151516] rounded-lg p-6 min-w-50 flex-1 max-w-100">
                <div className="text-5xl text-white font-light">Done</div>
                <div className="flex flex-col gap-y-3 w-full">
                    {tasks3.map((task, index) => (
                        <Sortable key={task.id} task={task} index={index} />
                    ))}
                </div>
            </div> */}
        </div>
    );
};

const Item = ({ task, index, column }) => {
    const { ref, isDragging } = useSortable({
        id: task,
        index,
        type: "item",
        accept: "item",
        group: column,
    });

    return (
        <div
            ref={ref}
            className="w-full bg-[#805802] rounded-md text-center text-white/70 text-3xl select-none py-1"
            data-dragging={isDragging}
        >
            {task}
        </div>
    );
};

const Column = ({ children, id }) => {
    const { isDropTarget, ref } = useDroppable({
        id,
        type: "column",
        accept: "item",
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div
            ref={ref}
            className={`flex flex-col items-center gap-y-6 bg-[#151516] rounded-lg p-6 min-w-50 flex-1 max-w-100 ${isDropTarget ? "bg-white" : ""}`}
        >
            <div className="text-5xl text-white font-light">id</div>
            <div className="flex flex-col gap-y-3 w-full">{children}</div>
        </div>
    );
};

export default Index;
