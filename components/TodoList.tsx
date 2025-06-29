'use client'

import { useEffect, useRef, useState } from "react";

type Todo = {
    id: number;
    title: string;
    completed: boolean
}

type Props = {
    todos: Todo[];
    loading: boolean;
    updateTodo: (id: number, title: string) => void;
    toggleTodo: (id: number, completed: boolean) => void;
    deleteTodo: (id: number) => void;
}

export const TodoList = ({
    todos,
    loading,
    updateTodo,
    toggleTodo,
    deleteTodo
}: Props) => {

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [editingId])

    if (loading) return <p>...Loading</p>;

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditingValue(todo.title);
    }

    const saveEditing = (id: number) => {
        const trimmed = editingValue.trim();
        if (trimmed) {
            updateTodo(id, trimmed);
        }
        setEditingId(null)
    }

    const cancelEditing = () => {
        setEditingId(null);
    }

    return (
        <ul className="TodoList">
            {todos.map(todo =>
                <li key={todo.id} className=" flex justify-between  items-center">
                    <div>
                        {editingId === todo.id ? <>
                            <input
                                ref={inputRef}
                                type="text"
                                className=" outline-0 border-b-2"
                                value={editingValue}
                                onChange={e => setEditingValue(e.target.value)}
                                onBlur={() => saveEditing(todo.id)}
                                onKeyDown={e => {
                                    if (e.key === 'Escape') { cancelEditing() }
                                    if (e.key === 'Enter') { saveEditing(todo.id) }
                                }}
                            />
                        </> : <>
                            <input
                                type='checkbox'
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id, !todo.completed)}

                            />
                            <span
                                onDoubleClick={() => startEditing(todo)}
                                className={`text-2xl ${todo.completed ? 'text-gray-50 line-through' : ''}`}
                            >
                                {todo.title}
                            </span>

                        </>}
                    </div>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
            )}
        </ul>
    )
}
