const { renderDOM } = require("./helpers"); // Make sure path is correct

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
  it("h1 is presented with correct text", () => {
    const h1 = document.querySelector("h1");
    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe("Welcome to the Secure Council Portal");
  });

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

//////Sign Up
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

  it("password input exists", () => {
    const password = document.getElementById("password");
    expect(password).toBeTruthy();
  });

  it("role selection exists", () => {
    const userrole = document.getElementById("userrole");
    expect(userrole).toBeTruthy();
  });

  it("login link exists with correct href", () => {
    const loginPath = document.querySelector('a[href="index.html"]');
    expect(loginPath).toBeTruthy();
    expect(loginPath.textContent).toContain("Log In");
  });
});

/////otp
describe("otp.html", () => {
  let dom;
  let document;

  beforeEach(async () => {
    dom = await renderDOM("../otp.html");
    document = dom.window.document;
  });

  it("OTP form is presented", () => {
    const form = document.getElementById("otpForm");
    expect(form).toBeTruthy();
  });

  it("OTP input exists with placeholder", () => {
    const otpInput = document.getElementById("otp");
    expect(otpInput).toBeTruthy();
    expect(otpInput.placeholder).toBe("••••••");
  });

  it("verify button exists text", () => {
    const verifyBtn = document.querySelector("button[type='submit']");
    expect(verifyBtn).toBeTruthy();
    expect(verifyBtn.textContent).toBe("Verify");
  });
});

/////maindash
describe("maindashboard.html", () => {
  let dom;
  let document;

  beforeEach(async () => {
    dom = await renderDOM("../maindashboard.html");
    document = dom.window.document;
  });

  it("create request button exists with correct href", () => {
    const createRequestBtn = document.querySelector(
      'a[href="./requestForm.html"]'
    );
    expect(createRequestBtn).toBeTruthy();
    expect(createRequestBtn.textContent).toBe("Create a New Request");
  });

  it("resources section exists", () => {
    const resources = document.querySelectorAll("h1")[2];
    expect(resources).toBeTruthy();
    expect(resources.textContent).toBe("Resources");
  });
});

////accountpage
describe("accountpage.html", () => {
  let dom;
  let document;

  beforeEach(async () => {
    dom = await renderDOM("../accountpage.html");
    document = dom.window.document;
  });

  it("account form is presented", () => {
    const form = document.getElementById("account-form");
    expect(form).toBeTruthy();
  });

  it("first name input exists", () => {
    const firstName = document.getElementById("firstName");
    expect(firstName).toBeTruthy();
  });

  it("edit details button exists", () => {
    const editBtn = document.querySelector(".btn-success");
    expect(editBtn).toBeTruthy();
  });

  it("delete account button exists", () => {
    const deleteBtn = document.querySelector(".btn-danger");
    expect(deleteBtn).toBeTruthy();
  });
});

/////request form

////request dash

////viewreq

////viewedit req
