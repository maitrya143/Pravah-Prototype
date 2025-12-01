// cypress/e2e/pravah_spec.cy.js
describe('Pravah mock end-to-end', () => {
    it('signup -> login -> select center -> add student -> mark attendance', () => {
      cy.visit('http://localhost:3000'); // adjust to your frontend port
      // Signup
      cy.get('[data-testid=signup-link]').click({ force: true });
      cy.get('[data-testid=signup-volunteer_id]').type('25MDA177');
      cy.get('[data-testid=signup-full_name]').type('Test Head');
      cy.get('[data-testid=signup-password]').type('Test@1234');
      cy.get('[data-testid=signup-submit]').click();
      // Login
      cy.get('[data-testid=login-volunteer_id]').type('25MDA177');
      cy.get('[data-testid=login-password]').type('Test@1234');
      cy.get('[data-testid=login-submit]').click();
      // Wait for centers and select
      cy.get('[data-testid=center-select]').should('be.visible').select('MOUDA_NATHNAGAR');
      cy.get('[data-testid=enter-center]').click();
      // Open New Admission
      cy.get('[data-testid=nav-new-admission]').click();
      cy.get('[data-testid=admission-name]').type('Rita Kumar');
      cy.get('[data-testid=admission-father_name]').type('Sunil Kumar');
      cy.get('[data-testid=admission-contact_no]').type('9999999999');
      cy.get('[data-testid=admission-submit]').click();
      // Verify student added in students page
      cy.get('[data-testid=nav-manual-attendance]').click();
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0);
      // Mark manual attendance
      cy.get('[data-testid=student-row]').first().find('[data-testid=present-checkbox]').check();
      cy.get('[data-testid=save-attendance]').click();
      cy.contains('Attendance saved').should('exist');
      // Use QR scan endpoint (mock) via API
      cy.request('POST','/api/attendance/scan',{ qr_string: 'c29tZXBhY2thZGRk' }).then(resp=>{
        expect(resp.status).to.equal(200);
        expect(resp.body.message).to.equal('marked');
      });
    });
  });
  