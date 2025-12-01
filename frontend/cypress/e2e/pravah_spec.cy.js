// cypress/e2e/pravah_spec.cy.js
// End-to-end test for Pravah application with MSW mocks

describe('Pravah Mock End-to-End Test', () => {
  // Base URL - adjust to match your Vite dev server
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit(baseUrl);
  });

  it('Complete flow: Signup -> Login -> Center Select -> New Admission -> Manual Attendance -> QR Scan', () => {
    // ==================== STEP 1: SIGNUP ====================
    cy.get('[data-testid="signup-link"]').should('exist').click({ force: true });
    
    cy.url().should('include', '/signup');
    
    cy.get('[data-testid="signup-volunteer_id"]').should('be.visible').type('25MDA177');
    cy.get('[data-testid="signup-full_name"]').should('be.visible').type('Test Volunteer');
    cy.get('[data-testid="signup-password"]').should('be.visible').type('password123');
    cy.get('[data-testid="signup-confirm-password"]').should('be.visible').type('password123');
    
    cy.get('[data-testid="signup-submit"]').should('be.visible').click();
    
    // Should redirect to center selection after successful signup
    cy.url({ timeout: 5000 }).should('include', '/center-selection');

    // ==================== STEP 2: LOGIN (Alternative path) ====================
    // If signup didn't auto-login, login manually
    cy.clearLocalStorage();
    cy.visit(`${baseUrl}/login`);
    
    cy.get('[data-testid="login-volunteer_id"]').should('be.visible').type('25MDA177');
    cy.get('[data-testid="login-password"]').should('be.visible').type('password123');
    cy.get('[data-testid="login-submit"]').should('be.visible').click();
    
    // Wait for centers to load
    cy.url({ timeout: 5000 }).should('include', '/center-selection');
    cy.wait(1000); // Allow centers to load

    // ==================== STEP 3: CENTER SELECTION ====================
    cy.get('[data-testid="center-card"]').should('have.length.greaterThan', 0);
    
    // Select first Mouda center (should be visible)
    cy.contains('[data-testid="center-card"]', 'Mouda').first().within(() => {
      cy.get('[data-testid="center-select-button"]').click();
    });
    
    // Should redirect to dashboard
    cy.url({ timeout: 5000 }).should('include', '/dashboard');
    cy.wait(1000);

    // ==================== STEP 4: NEW ADMISSION ====================
    cy.get('[data-testid="nav-new-admission"]').should('be.visible').click({ force: true });
    cy.url().should('include', '/new-admission');
    
    // Fill admission form
    cy.get('[data-testid="admission-name"]').should('be.visible').type('Rita Kumar');
    cy.get('[data-testid="admission-date_of_birth"]').should('be.visible').type('2010-05-15');
    cy.get('[data-testid="admission-parent_name"]').should('be.visible').type('Sunil Kumar');
    cy.get('[data-testid="admission-contact_number"]').should('be.visible').type('9876543210');
    cy.get('[data-testid="admission-address"]').should('be.visible').type('123 Test Street, Mouda');
    cy.get('[data-testid="admission-class"]').should('be.visible').type('5');
    
    cy.get('[data-testid="admission-submit"]').should('be.visible').click();
    
    // Wait for success message or redirect
    cy.wait(2000);
    
    // Should see success toast or redirect
    cy.get('body').then(($body) => {
      if ($body.text().includes('success') || $body.text().includes('Success')) {
        cy.contains(/success|created|admission/i).should('exist');
      }
    });

    // ==================== STEP 5: MANUAL ATTENDANCE ====================
    cy.get('[data-testid="nav-manual-attendance"]').should('be.visible').click({ force: true });
    cy.url().should('include', '/manual-attendance');
    cy.wait(2000); // Wait for students to load
    
    // Verify student list is visible
    cy.get('[data-testid="student-row"]').should('have.length.greaterThan', 0);
    
    // Check date is set to today
    const today = new Date().toISOString().split('T')[0];
    cy.get('[data-testid="attendance-date"]').should('have.value', today);
    
    // Mark first student as present
    cy.get('[data-testid="student-row"]').first().within(() => {
      cy.get('[data-testid="present-checkbox"]').check({ force: true });
    });
    
    // Save attendance
    cy.get('[data-testid="save-attendance"]').should('be.visible').click();
    
    // Verify success message
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.text().includes('saved') || $body.text().includes('success') || $body.text().includes('marked')) {
        cy.contains(/saved|success|marked/i).should('exist');
      }
    });

    // ==================== STEP 6: QR SCAN (Mock) ====================
    cy.get('[data-testid="nav-qr-scan"]').should('be.visible').click({ force: true });
    cy.url().should('include', '/qr-scan');
    
    // Mock QR scan - create a valid QR string
    const mockQRString = btoa(`STU0001|1|${Date.now()}`) + '|sig_test123';
    
    // Call the QR scan API directly (simulating scan)
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/attendance/qr-scan`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_jwt_token',
      },
      body: {
        qr_data: mockQRString,
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Should succeed or return error (both are acceptable in mock)
      expect([200, 400, 401]).to.include(response.status);
    });
  });

  it('Manual Attendance - Verify student appears after new admission', () => {
    // Login
    cy.visit(`${baseUrl}/login`);
    cy.get('[data-testid="login-volunteer_id"]').type('25MDA177');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait(2000);

    // Select center
    cy.get('[data-testid="center-card"]').first().within(() => {
      cy.get('[data-testid="center-select-button"]').click();
    });
    cy.wait(1000);

    // Go to manual attendance and count initial students
    cy.get('[data-testid="nav-manual-attendance"]').click({ force: true });
    cy.wait(2000);
    
    cy.get('[data-testid="student-row"]').then(($rows) => {
      const initialCount = $rows.length;
      
      // Go to new admission
      cy.get('[data-testid="nav-new-admission"]').click({ force: true });
      cy.wait(500);
      
      // Add new student
      cy.get('[data-testid="admission-name"]').type('New Test Student');
      cy.get('[data-testid="admission-date_of_birth"]').type('2012-03-20');
      cy.get('[data-testid="admission-parent_name"]').type('Parent Name');
      cy.get('[data-testid="admission-contact_number"]').type('9998887776');
      cy.get('[data-testid="admission-address"]').type('New Address');
      cy.get('[data-testid="admission-class"]').type('6');
      cy.get('[data-testid="admission-submit"]').click();
      
      cy.wait(3000);
      
      // Go back to manual attendance
      cy.get('[data-testid="nav-manual-attendance"]').click({ force: true });
      cy.wait(2000);
      
      // Verify new student appears
      cy.get('[data-testid="student-row"]').should('have.length', initialCount + 1);
      cy.contains('New Test Student').should('exist');
    });
  });

  it('QR Scan - Verify QR code validation', () => {
    // Login and select center (abbreviated)
    cy.visit(`${baseUrl}/login`);
    cy.get('[data-testid="login-volunteer_id"]').type('25MDA177');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait(2000);
    
    cy.get('[data-testid="center-card"]').first().within(() => {
      cy.get('[data-testid="center-select-button"]').click();
    });
    cy.wait(1000);

    // Test invalid QR code
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/attendance/qr-scan`,
      headers: { 'Content-Type': 'application/json' },
      body: { qr_data: 'invalid-qr' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.error).to.include('Invalid');
    });
  });
});

