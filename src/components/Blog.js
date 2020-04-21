import React, { useState } from 'react'
//import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [showAllInfo, setShowAllInfo] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const restOfInfo = () => {
    //console.log(blog, user)
    return (
      <>
        <div>{blog.url}</div>
        <div>
          <span className='likes'>{blog.likes}</span>
          <button className='like' onClick={likeBlog}>
            like
          </button>
        </div>
        <div>{blog.author}</div>
        <div>{deleteButton()}</div>
      </>
    )
  }

  const deleteButton = () => {
    if (blog.user.username === user.username)
      return (
        <button className='remove' onClick={removeBlog}>
          remove
        </button>
      )
  }
  /*
  const likeBlog = () => {
    const id = blog.id
    const title = blog.title

    const updatedObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    blogService
      .update(id, updatedObject)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
        showSystemStatus({ success: `Blog '${title}' was liked` })
      })
      .catch(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        showSystemStatus({ error: `Blog '${title}' was already removed from server` })
      })
  }
  */

  /*
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const id = blog.id

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
*/

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button className='view' onClick={() => setShowAllInfo(!showAllInfo)}>
          {showAllInfo ? 'hide' : 'view'}
        </button>
      </div>
      {showAllInfo && restOfInfo()}
    </div>
  )
}

/*
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  showSystemStatus: PropTypes.func.isRequired,
}
*/

export default Blog
