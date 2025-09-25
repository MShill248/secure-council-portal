///accountp
const { renderDOM } = require("./helpers");
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
