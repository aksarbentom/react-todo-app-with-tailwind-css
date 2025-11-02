import React, { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Trash2, Plus, Calendar, Star, Filter, Search, Sparkles } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  dueDate?: Date
}

type FilterType = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos)
      setTodos(parsed.map((todo: Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      })))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        priority,
        createdAt: new Date()
      }
      setTodos([newTodo, ...todos])
      setInputValue('')
      setPriority('medium')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter(todo => 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-error/20 to-error/5 border-error/30'
      case 'medium': return 'from-warning/20 to-warning/5 border-warning/30'
      case 'low': return 'from-success/20 to-success/5 border-success/30'
      default: return 'from-surface to-background border-border'
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error'
      case 'medium': return 'bg-warning'
      case 'low': return 'bg-success'
      default: return 'bg-textSecondary'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-lg shadow-primary/20 transform hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            TaskFlow
          </h1>
          <p className="text-textSecondary text-lg">Organize your life, beautifully</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-4 hover:bg-surface/70 transition-all duration-300 hover:scale-105">
            <div className="text-textSecondary text-sm mb-1">Total</div>
            <div className="text-3xl font-bold text-text">{stats.total}</div>
          </div>
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-4 hover:bg-surface/70 transition-all duration-300 hover:scale-105">
            <div className="text-textSecondary text-sm mb-1">Active</div>
            <div className="text-3xl font-bold text-secondary">{stats.active}</div>
          </div>
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-4 hover:bg-surface/70 transition-all duration-300 hover:scale-105">
            <div className="text-textSecondary text-sm mb-1">Done</div>
            <div className="text-3xl font-bold text-success">{stats.completed}</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="bg-background/50 border border-border rounded-2xl px-4 py-4 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-surface/50 backdrop-blur-sm border border-border rounded-2xl pl-12 pr-4 py-3 text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
            />
          </div>
          <div className="flex gap-2 bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-1">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                  filter === f
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-textSecondary hover:text-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-surface/50 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-textSecondary" />
              </div>
              <p className="text-textSecondary text-lg">
                {searchQuery ? 'No tasks found' : todos.length === 0 ? 'No tasks yet. Add one to get started!' : 'All done! 🎉'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`group bg-gradient-to-r ${getPriorityColor(todo.priority)} backdrop-blur-sm border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slide-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 mt-1 transition-transform duration-300 hover:scale-110"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-textSecondary hover:text-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg ${todo.completed ? 'line-through text-textSecondary' : 'text-text'} break-words`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${getPriorityDot(todo.priority)}`}></div>
                        <span className="text-xs text-textSecondary capitalize">{todo.priority}</span>
                      </div>
                      <span className="text-xs text-textSecondary">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-error hover:text-error/80"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-textSecondary text-sm">
          <p>Made with ❤️ using React & Tailwind CSS</p>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
          opacity: 0;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}

export default App
