import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)

  const blogFormRef = React.createRef()
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showSystemStatus = (statusObject) => {
    setSystemStatus(statusObject)
    setTimeout(function () {
      setSystemStatus(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showSystemStatus({ error: 'wrong username or password' })
    }
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        blogFormRef.current.toggleVisibility()
        showSystemStatus({ success: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added` })
        setBlogs(blogs.concat(returnedBlog))
        blogService.getAll().then((blogs) => setBlogs(blogs))
      })
      .catch((exception) => {
        const errorResponse = exception.response.data
        const errorMessage = errorResponse.error
        showSystemStatus({ error: errorMessage })
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const likeBlog = (id) => {
    const blog = blogs.find((n) => n.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const title = blog.title

    console.log(blog)
    blogService
      .update(id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
        showSystemStatus({ success: `Blog '${title}' was liked` })
        blogService.getAll().then((blogs) => setBlogs(blogs))
      })
      .catch(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        showSystemStatus({ error: `Blog '${title}' was already removed from server` })
      })
  }

  const removeBlog = (id) => {
    const blog = blogs.find((n) => n.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(id)
        .then(() => {
          showSystemStatus({ success: `Blog '${blog.title}' was removed` })
        })
        .catch(() => {
          showSystemStatus({ error: `Blog '${blog.title}' was already removed from server` })
        })

      setBlogs(blogs.filter((blog) => blog.id !== id))
    }
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification systemStatus={systemStatus} />
        <form onSubmit={handleLogin}>
          <div>
            username <input id='username' type='text' onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password <input id='password' type='password' onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button id='login-button' type='submit'>
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification systemStatus={systemStatus} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      {blogForm()}
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} likeBlog={() => likeBlog(blog.id)} removeBlog={() => removeBlog(blog.id)} />
      ))}
    </div>
  )
}

export default App
