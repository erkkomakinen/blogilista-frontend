import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let user = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…2MDV9.RueEtAnl7sHrKNM8lLKG9n-AXudvgY-ojQx1sgCPvvk',
    username: 'erlimaki',
    name: 'Erkko Mäkinen',
  }
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'url.fi',
    likes: 4,
    user: '5e95bf68db02592208deb1aa',
  }
  const LikeMockHandler = jest.fn()

  beforeEach(() => {
    component = render(<Blog blog={blog} user={user} likeBlog={LikeMockHandler} />)
  })

  test('renders only tite and author by default', () => {
    expect(component.container).toHaveTextContent('blog title')
    expect(component.container).toHaveTextContent('blog author')
    expect(component.container).not.toHaveTextContent('url.fi')
    expect(component.container).not.toHaveTextContent('4')
    //expect(component.container).not.toHaveTextContent('5e95bf68db02592208deb1aa')
    //component.debug()
  })

  test('renders url and likes after clicking the view button', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    expect(component.container).toHaveTextContent('blog title')
    expect(component.container).toHaveTextContent('blog author')
    expect(component.container).toHaveTextContent('url.fi')
    expect(component.container).toHaveTextContent('4')

    //component.debug()
  })

  test('calls LikeBlog event handler twice when blog is liked twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(LikeMockHandler.mock.calls).toHaveLength(2)
  })
})

/*
test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = jest.fn()

  const component = render(<Note note={note} toggleImportance={mockHandler} />)

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
*/
