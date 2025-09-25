const { renderDOM } = require("./helpers");

/////login
describe("index.html", () => {
  let dom;
  let document;

  //runs before each test
  beforeEach(async () => {
    dom = await renderDOM("../index.html");
    document = dom.window.document;
  });

  // tests

  it("login form is presented", () => {
    const form = document.getElementById("loginForm");
    expect(form).toBeTruthy();
  });

  it("username input exists with placeholder", () => {
    const username = document.getElementById("floatingInput");
    expect(username).toBeTruthy();
    expect(username.placeholder).toBe("Username");
  });

  it("password input exists with placeholder", () => {
    const password = document.getElementById("floatingPassword");
    expect(password).toBeTruthy();
    expect(password.placeholder).toBe("Password");
  });

  it("submit button exists with correct text", () => {
    const submitBtn = document.querySelector("button[type='submit']");
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.textContent).toBe("Login");
  });

  it("signup link exists with correct href", () => {
    const signupLink = document.querySelector('a[href="signup.html"]');
    expect(signupLink).toBeTruthy();
    expect(signupLink.textContent).toContain("Sign up");
  });

});



