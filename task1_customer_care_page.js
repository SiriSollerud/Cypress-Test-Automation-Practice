/// <reference types="Cypress" />

describe('testing factorial calculator', () => {
    before(() => {
        cy.visit('https://parabank.parasoft.com/parabank/index.htm');
    })

    it('tests customer care page scenario', () => {
        let name = 'Jane Doe';
        let email = 'fake@mail.com';
        let phone = '12345678';
        let message = 'this website is fake, plz fix';

        cy.get('.contact').click();
        cy.get('#name').type(name);
        cy.get('#email').type(email);
        cy.get('#phone').type(phone);
        cy.get('#message').type(message);
        cy.get('#contactForm').submit();
        cy.get('#rightPanel').should('contain', "Thank you " + name);
    })
   
})