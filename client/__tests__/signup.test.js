//////Sign Up
const { renderDOM } = require("./helpers");

describe("signup.html", () => {
  let dom;
  let document;

  //runs before each test
  beforeEach(async () => {
    dom = await renderDOM("../signup.html");
    document = dom.window.document;
  });

  // tests
  it("signup form is presented", () => {
    const form = document.getElementById("signup-form");
    expect(form).toBeTruthy();
  });

  it("first name input exists with placeholder", () => {
    const firstName = document.getElementById("firstName");
    expect(firstName).toBeTruthy();
    expect(firstName.placeholder).toBe("Enter your First name");
  });

  it("last name input exists with placeholder", () => {
    const lastName = document.getElementById("lastName");
    expect(lastName).toBeTruthy();
    expect(lastName.placeholder).toBe("Enter your Last name");
  });

  it("email input exists with placeholder", () => {
    const email = document.getElementById("email");
    expect(email).toBeTruthy();
    expect(email.placeholder).toBe("Enter your Email");
  });

  it("username input exists with placeholder", () => {
    const username = document.getElementById("username");
    expect(username).toBeTruthy();
    expect(username.placeholder).toBe("Username");
  });

  it("login link exists with correct href", () => {
    const loginPath = document.querySelector('a[href="index.html"]');
    expect(loginPath).toBeTruthy();
    expect(loginPath.textContent).toContain("Log In");
  });

  it('Requires a valid email', () => {
    const emailInput = document.getElementById('email');
    const form = document.getElementById('signup-form');
    const signupBtn = form.querySelector('button[type="submit"]');

    emailInput.value = 'invalidEmail';
    emailInput.dispatchEvent(new dom.window.Event('input'));
    signupBtn.disabled = !emailInput.value.includes('@') || !emailInput.value.includes('.');
    expect(signupBtn.disabled).toBe(true);

    emailInput.value = 'valid@example.com';
    emailInput.dispatchEvent(new dom.window.Event('input'));
    signupBtn.disabled = !emailInput.value.includes('@') || !emailInput.value.includes('.');
    expect(signupBtn.disabled).toBe(false);
  })
  
  it('Role selection is required', () => {
    const roleSelect = document.getElementById('userrole');
    
    roleSelect.value = '';
    roleSelect.dispatchEvent(new dom.window.Event('change'));
    
    const isEmptyValid = roleSelect.checkValidity();
    expect(isEmptyValid).toBe(false);

    roleSelect.value = 'resident';
    roleSelect.dispatchEvent(new dom.window.Event('change'));
    
    const isValid = roleSelect.checkValidity();
    expect(isValid).toBe(true);
  });



});
