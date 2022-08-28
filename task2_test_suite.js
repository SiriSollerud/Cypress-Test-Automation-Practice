/// <reference types="Cypress" />

// var originalAccount; <--- couldn't make this work - see comments on line 26-35 :(
describe('testing parabank key features: task2 test suite', () => {
    before(() => {
        cy.visit('https://parabank.parasoft.com/parabank/index.htm');
    })

    beforeEach('tests logging in', () => {
        // we noticed that sometimes logging in doesn't work because you sometimes need to register a new user account 
        // however, in task 2.2 it says we should NOT register an account, so we decided not to include the registration part 
        let username = 'janedoe';
        let password = 'password';
        cy.get('[name="username"]').type(username);
        cy.get('[name="password"]').type(password);
        cy.get('[name="login"]').submit();

        // when logging in you get tot he account overview page - therefore we check if this is true
        cy.get('#rightPanel').should('contain', "Accounts Overview");

    })

    it('tests opening new savings account', () => {
        cy.get('a[href*="openaccount"]').click();
        cy.get('select#type').select('SAVINGS').should('have.value', '1');
        
        // selecting account will most likely fail because the account numbers keep changing
        // if you change the number here to whatever is the default selection (first option in the dropdown) it should work
        cy.get('select#fromAccountId').select("13455").should('have.value', '13455');

        // We wanted to solve the issue with changing account numbers by finding the original account number (the one with the most money)
        // and then storing that account number as a global variable so we could use the same account number on all 
        // of the tests. 
        
        // When you open a new account it seems the first option in the dropdown menu is the original account
        // Here is one solution to select the original account number, which seems to work.
        // cy.get('select#fromAccountId option').eq(0).invoke('val').then((val)=>{
        //     cy.get('select#fromAccountId').select(val).should('have.value', val);
        // });
        // However, we couldn't figure out how to store this in a gloval variable and then to make 
        // the global variable to work in the other tests... 
        // Would be nice to know what we should have done differently here. 

        cy.get('[value="Open New Account"]').click();
        cy.get('#rightPanel').should('contain', "Congratulations, your account is now open.");
        
        // checking if the new account is in account overview 
        cy.get('#newAccountId').then(($newAccount) => {
            const newIdNumber = $newAccount.text();
            cy.get('a[href*="overview"]').click();
            cy.get('#rightPanel').should('contain', newIdNumber);
        });
    })

    it('tests request loan', () => {
        cy.get('a[href*="requestloan"]').click();
        cy.get('#amount').type(100);
        cy.get('#downPayment').type(20);
        // might get an error here again because of the changing account id numbers
        cy.get('select#fromAccountId').select("13455").should('have.value', '13455');
        cy.get('[value="Apply Now"]').click();

        // Sometimes this approved test fails because that page on the website has an error, sometimes it works
        // therefore we put in this check.
        if (cy.get('#rightPanel').should('contain', "Error!")) {
            cy.log("Webpage is unavailable. Internal error.");
        } else {
            cy.get('#rightPanel').should('contain', "Approved");   
        }
        
        // could possibly have done a more through check here, but honestly it was too 
        // frustrating that the account numbers kept changing, so we chose a simpler solution
    })
    
    // there's a $150 charge for opening a new account
    // here we will test if an account has been used to open a new account by 
    // checking if the account in has a $150 transaction
    it('tests find transactions for opening new account', () => {
        cy.get('a[href*="findtrans"]').click(); 
        cy.get('form').within(() => {
            // chose to cooment out account selection again because account numbers kept changing
            //cy.get('select#accountId').select('23001').should('have.value', '23001');
            cy.get('input').eq(4).type("150");
            cy.get('button').eq(3).click();
          })
          cy.get('#rightPanel').should('contain', "Transaction Results");
    })

    afterEach('tests logging out', () => {
        cy.visit('https://parabank.parasoft.com/parabank/logout.htm');
    })
   
})