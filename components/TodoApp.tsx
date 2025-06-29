import useTodos from "@/hooks/useTodos"
import { NewTodo } from "./NewTodo"
import { TodoList } from "./TodoList"

export const TodoApp = () => {
    const {
        todos,
        loading,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo
    } = useTodos();

    return (
        <div className="TodoApp mx-auto mt-4 p-4 rounded-2xl bg-slate-200 w-[500px]">
            <NewTodo addTodo={addTodo}/>
            <TodoList
                todos={todos}
                loading={loading}
                updateTodo={updateTodo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
            />
        </div>
    )
}
