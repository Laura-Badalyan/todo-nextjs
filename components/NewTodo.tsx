'use client'

import { useState } from "react"

type Props = {
  addTodo: (title: string) => void
}


export const NewTodo = ({ addTodo }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      addTodo(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <form
      className="NewTodo flex justify-between"
      onSubmit={handlerSubmit}
    >
      <input
      className=" outline-0 border-b-2 border-slate-300 text-3xl"
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button>Add</button>
    </form>
  )
}
