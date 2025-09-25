/////maindash
const { renderDOM } = require("./helpers");

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

  it('My Requests button links to request dashboard', () => {
    const requestsBtn = document.querySelector('a[href="./requestdashboard.html"]');
    expect(requestsBtn).toBeTruthy();
    expect(requestsBtn.getAttribute('href')).toBe('./requestdashboard.html');
    expect(requestsBtn.textContent).toBe('My Requests');
  });

});