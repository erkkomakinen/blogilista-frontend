import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({})

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }

    createBlog(blogObject)
    setNewBlog({})
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title <input id='title' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} value={newBlog.title || ''} />
      </div>
      <div>
        url <input id='url' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} value={newBlog.url || ''} />
      </div>
      <div>
        author{' '}
        <input id='author' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} value={newBlog.author || ''} />
      </div>
      <button id='create-blog'>create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
