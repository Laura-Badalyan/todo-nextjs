'use client';

import { useEffect, useState } from "react";

type Todo = { id: number, title: string, completed: boolean };

export default function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos()
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await fetch('/api/todos');
            if (!res.ok) {
                throw new Error(`Failed to fetch todos: ${res.status}`);
            }
            const todos = (await res.json()) as Todo[];
            setTodos(todos)
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false)
        }
    }

    const addTodo = async (title: string) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            if (!res.ok) {
                throw new Error(`Failed to add todo: ${res.status}`);
            }
            const newTodo = (await res.json()) as Todo;
            //setTodos([...todos, newTodo]);
            setTodos(prev => [newTodo, ...prev]);
        } catch (error) {
            console.error('Failed to add todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTodo = async (id: number, title: string) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, title })
            });
            if (!res.ok) {
                throw new Error(`Failed to add todo: ${res.status}`);
            }
            const updatedTodo = (await res.json()) as Todo;
            setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
        } catch (error) {
            console.error('Failed to update todo:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTodo = async (id: number, completed: boolean) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed })
            });
            if (!res.ok) {
                throw new Error(`Failed to toggle todo: ${res.status}`);
            };
            const updatedTodo = (await res.json()) as Todo;
            setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        } finally {
            setLoading(false);
        }
    };


    const deleteTodo = async (id: number) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) {
                throw new Error(`Failed to delete todo: ${res.status}`);
            };
            setTodos(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error('Failed to delete todo:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        todos,
        loading,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo
    }

};