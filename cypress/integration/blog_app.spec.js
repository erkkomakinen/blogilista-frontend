describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Erkko Mäkinen',
      username: 'erlimaki',
      password: 'salasana',
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('erlimaki')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Erkko Mäkinen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('doesNotExist')
      cy.get('#password').type('doesNotExist')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Erkko Mäkinen logged in')
    })
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'erlimaki', password: 'salasana' })
    })

    it('a new blog can be created', function () {
      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.contains('blog title')
      cy.contains('Erkko Mäkinen')
    })

    it('a blog can be liked', function () {
      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.get('.view').click()
      cy.get('.likes').should('contain', '0')

      cy.get('.like').click()
      cy.get('.likes').should('contain', '1')
    })

    it('a blog can be deleted', function () {
      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('blog title')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.get('.view').click()
      cy.get('.remove').click()

      cy.get('.blog').should('not.exist')
    })

    it.only('blogs are shown in right order by likes', function () {
      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('added first')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('added second')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.get('.togglable').contains('new blog').click()
      cy.get('#title').type('added third')
      cy.get('#url').type('blog-url.fi')
      cy.get('#author').type('Erkko Mäkinen')
      cy.get('#create-blog').click()

      cy.get('.togglable').contains('new blog').click()

      cy.get('.view').click({ multiple: true })

      cy.get('.blog').then(($blogs) => {
        cy.wrap($blogs[2]).find('.like').click()
        cy.wrap($blogs[2]).find('.like').click()
        cy.wrap($blogs[1]).find('.like').click()
      })

      cy.get('.blog').then(($blogs) => {
        cy.wrap($blogs[0]).should('contain', 2)
        cy.wrap($blogs[1]).should('contain', 1)
        cy.wrap($blogs[2]).should('contain', 0)
      })
    })
  })
})
