/////otp
const { renderDOM } = require("./helpers");

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

  

});