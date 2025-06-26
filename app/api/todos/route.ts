import { prisma } from '@/lib/prisma'
import { z } from 'zod';
import { NextResponse } from "next/server";

const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required")
});

const updateTodoScema = z.object({
    id: z.union([z.string(), z.number()]).transform(val => Number(val)),
    title: z.string().optional(),
    completed: z.boolean().optional()
});

const deleteTodoSchema = z.object({
    id: z.union([z.string(), z.number()]).transform(val => Number(val)),
})

export async function GET() {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(todos, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Error fetching Todos" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = createTodoSchema.safeParse(body);
        if (!parsed.success) {
            const msg = parsed.error.errors.map(e => e.message)
            return NextResponse.json(
                { error: msg },
                { status: 400 }
            );
        }
        const { title } = parsed.data;
        const todo = await prisma.todo.create({ data: { title } })

        return NextResponse.json(todo, { status: 201 });

    } catch (error) {
        console.error(error)
        return NextResponse.json(error, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const parsed = updateTodoScema.safeParse(body);

        if (!parsed.success) {
            const msg = parsed.error.errors.map(e => e.message);
            return NextResponse.json(
                { error: msg },
                { status: 400 }
            );
        };

        const { id, title, completed } = parsed.data;
        const existing = await prisma.todo.findUnique({ where: { id } });

        if (!existing) {
            return NextResponse.json(
                { error: "Todo not found" },
                { status: 404 }
            )
        };

        const updatedData: { title?: string, completed?: boolean } = {}
        if (typeof title === 'string') {
            updatedData.title = title;
        };
        if (typeof completed === 'boolean') {
            updatedData.completed = completed;
        };

        const updated = await prisma.todo.update({
            where: { id },
            data: updatedData
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json(error, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const parsed = deleteTodoSchema.safeParse(body);

        if (!parsed.success) {
            const msg = parsed.error.errors.map(e => e.message);
            return NextResponse.json(
                { error: msg },
                { status: 400 }
            )
        };
        const { id } = parsed.data;

        const existing = await prisma.todo.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json(
                { error: "Todo not found" },
                { status: 404 }
            )
        };

        await prisma.todo.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error deleting todo" }, { status: 500 });
    }
}