// here we are.
// please tell me you notice that I set up eslint just for this demo.
// please...? someone...?
describe('Sanity Checks', () => {
  it('this is obviously not right', () => {
    expect(true).to.equal(true)
  })
})

// let's mark a pause and admire how sleek the interface looks <3 <3 <3

describe('Logged Out User', () => {
  it('can subscribe to an abo', () => {
    // in a CI/CD pipeline, this could run against staging
    cy.visit('https://republik.ch')

    // no timeouts from hell, that's pretty cool

    // if the copy changes we are in shit city
    cy.contains('Jetzt abonnieren').click()

    cy.contains('Jahresmitgliedschaft').click()

    // cypress recommends adding cypress data attrs to insulate from change:
    // https://docs.cypress.io/guides/references/best-practices#Selecting-Elements
    cy.get('[name=firstName]').type('Anna')
    cy.get('[name=lastName]').type('Traussnig')

    // signing someone up is kind of a one of...
    // would need backend to set up a resuable test email
    // OR: intercept/modify requests (it seems like a fair bit of work)
    // https://docs.cypress.io/guides/testing-strategies/working-with-graphql#Modifying-a-Query-or-Mutation-Response
    cy.get('[name=email]').type('anna.traussnig@republik.ch')

    // maybe attacking the crazy payment iframe wasn't the wisest move
    // i give up

    // i'll try to accept the AGB instead
    // lol, that so not in line with cy's best practices
    cy.get('[type="checkbox"]')
      .first()
      .check({ force: true })
    // the linter is rolling its eyes

    cy.contains('CHF 240 bezahlen').click()
    cy.contains('Fehler')
  })
})

// OPEN QUESTIONS:
//  - run against localhost
//  - stubbing/spying etc.
