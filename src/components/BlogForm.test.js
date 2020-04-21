import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm'

test('createBlog function is called with correct form information', () => {
  const createBlog = jest.fn()
  const component = render(<BlogForm createBlog={createBlog} />)

  const titleInput = component.container.querySelector('#title')
  const urlInput = component.container.querySelector('#url')
  const authorInput = component.container.querySelector('#author')

  fireEvent.change(titleInput, {
    target: { value: 'title' },
  })
  fireEvent.change(urlInput, {
    target: { value: 'url' },
  })
  fireEvent.change(authorInput, {
    target: { value: 'author' },
  })

  const form = component.container.querySelector('form')
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  const title = createBlog.mock.calls[0][0].title
  const url = createBlog.mock.calls[0][0].url
  const author = createBlog.mock.calls[0][0].author

  expect(title).toBe('title')
  expect(url).toBe('url')
  expect(author).toBe('author')
  //expect(component.container).not.toHaveTextContent('5e95bf68db02592208deb1aa')
  //component.debug()
})
