// cypress/support/commands.js
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example custom command
Cypress.Commands.add('login', (volunteerId, password) => {
  cy.visit('/login');
  cy.get('[data-testid="login-volunteer_id"]').type(volunteerId);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();
  cy.url({ timeout: 5000 }).should('include', '/center-selection');
});

