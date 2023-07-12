// GLEN HERE
const navbarText = Cypress.env("navbarText");
const randomNumber = Math.floor(Math.random() * 10000);
// tests for signup
context("Signup Page Tests", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("greets with proper nav bar", () => {
    cy.findByText(navbarText).should("exist");
  });

  it("links to / (login page)", () => {
    cy.get(
      ".MuiTypography-root.MuiTypography-body2.MuiLink-root.MuiLink-underlineAlways.css-101ca9i-MuiTypography-root-MuiLink-root"
    ).should("have.attr", "href", "/");
  });

  it("requires first name field to have a value", () => {
    cy.intercept("POST", "/auth/signup").as("signupRequest");
    cy.get("input")
      .eq(1)
      .type("lastname" + randomNumber);
    cy.get("input")
      .eq(2)
      .type("emailaddress" + randomNumber + "@random.com");
    cy.get("input").eq(3).type(randomNumber);
    cy.get("input").eq(4).type(randomNumber);
    cy.get("button").first().click();
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(400);
    });
  });

  it("requires last name field to have a value - response is a 400 status if field is missing", () => {
    cy.intercept("POST", "/auth/signup").as("signupRequest");
    cy.get("input")
      .eq(0)
      .type("firstname" + randomNumber);
    cy.get("input")
      .eq(2)
      .type("emailaddress" + randomNumber + "@random.com");
    cy.get("input").eq(3).type(randomNumber);
    cy.get("input").eq(4).type(randomNumber);
    cy.get("button").first().click();
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(400);
    });
  });

  it("requires email field to have a value - response is a 400 status if field is missing", () => {
    cy.intercept("POST", "/auth/signup").as("signupRequest");
    cy.get("input")
      .eq(0)
      .type("firstname" + randomNumber);
    cy.get("input")
      .eq(1)
      .type("lastname" + randomNumber + "@random.com");
    cy.get("input").eq(3).type(randomNumber);
    cy.get("input").eq(4).type(randomNumber);
    cy.get("button").first().click();
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(400);
    });
  });

  it("requires both password fields to be filled out and match", () => {
    cy.intercept("POST", "/auth/signup").as("signupRequest");
    cy.get("input")
      .eq(0)
      .type("firstname" + randomNumber);
    cy.get("input")
      .eq(1)
      .type("lastname" + randomNumber + "@random.com");
    cy.get("input")
      .eq(2)
      .type("emailaddress" + randomNumber + "@random.com");
    cy.get("input").eq(3).type(randomNumber);
    cy.get("input")
      .eq(4)
      .type(randomNumber + 2);
    cy.get("button").first().click();
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(400);
    });
  });

  it("successfully logs in a new, unique user", () => {
    cy.intercept("POST", "/auth/signup").as("signupRequest");
    cy.get("input")
      .eq(0)
      .type("firstname" + randomNumber);
    cy.get("input")
      .eq(1)
      .type("lastname" + randomNumber);
    cy.get("input")
      .eq(2)
      .type("emailaddress" + randomNumber + "@random.com");
    cy.get("input").eq(3).type(randomNumber);
    cy.get("input").eq(4).type(randomNumber);
    cy.get("button").first().click();
    cy.wait("@signupRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      const responseBody = interception.response.body;
      const expectedString = "Successful signup!";
      expect(responseBody).to.include(expectedString);
    });
    cy.url().should("include", "/userprojects");
  });

  it("deletes new, created user from database", () => {
    const expectedString = "emailaddress" + randomNumber + "@random.com";
    cy.request("DELETE", `/user/deleteuser/${expectedString}`).then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.include(expectedString);
      }
    );
  });
});

// it navigates correctly after signup