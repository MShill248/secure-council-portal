const { renderDOM } = require('./helpers');

describe('View Request Page (Council)', () => {
  let dom;
  let document;

  beforeEach(async () => {
    dom = await renderDOM('../viewRequest.html');
    document = dom.window.document;
  });

  it('has a Submit button', () => {
    const submitBtn = document.getElementById('submitBtn');
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.textContent).toBe('Submit');
  });

  it('Cancel button is present', () => {
    const cancelBtn = document.getElementById('cancelBtn');
    expect(cancelBtn).toBeTruthy();
    expect(cancelBtn.textContent).toBe('Cancel');
  });

  it('Resident information fields are readonly', () => {
    const residentName = document.getElementById('residentName');
    const residentAddress = document.getElementById('residentAddress');
    const residentPhone = document.getElementById('residentPhone');
    
    expect(residentName.readOnly).toBe(true);
    expect(residentAddress.readOnly).toBe(true);
    expect(residentPhone.readOnly).toBe(true);
  });

  it('Request description is readonly', () => {
    const requestDescription = document.getElementById('requestDescription');
    expect(requestDescription.readOnly).toBe(true);
  });

  it('Council message area is editable', () => {
    const councilMessage = document.getElementById('councilMessage');
    expect(councilMessage).toBeTruthy();
    expect(councilMessage.readOnly).toBe(false);
  });

  it('Priority selection works', () => {
    const prioritySelect = document.getElementById('Priority');
    const options = prioritySelect.querySelectorAll('option');
    
    expect(prioritySelect).toBeTruthy();
    expect(options.length).toBe(4); 
    expect(options[1].value).toBe('3');
    expect(options[1].textContent).toBe('High');
  });

  it('Resolved checkbox is present', () => {
    const resolvedCheckbox = document.getElementById('resolved');
    expect(resolvedCheckbox).toBeTruthy();
    expect(resolvedCheckbox.type).toBe('checkbox');
  });

  it('Able to type council message', () => {
    const councilMessage = document.getElementById('councilMessage');
    councilMessage.value = 'This issue has been assigned to our team';
    expect(councilMessage.value).toBe('This issue has been assigned to our team');
  });
})