const { renderDOM } = require('./helpers');

describe('Request Form Page', () => {
  let dom;
  let document;


   beforeEach(async () => {
    dom = await renderDOM('../requestForm.html');
    document = dom.window.document;
  }); 

  it('has a submit button', () => {
    const btn = document.querySelector('button[type="submit"]');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toBe('Submit');
  });

  it('Cancel button goes back in history', () => {
    const cancelBtn = document.querySelector('.btn-outline-secondary');
    expect(cancelBtn).toBeTruthy();
    expect(cancelBtn.getAttribute('onclick')).toBe('history.back()');
    expect(cancelBtn.textContent.trim()).toBe('Cancel');
  });

  it('Able to type in all form fields', () => {
    const titleInput = document.getElementById('Title');
    const descriptionInput = document.getElementById('description');

    titleInput.value = 'Test Request Title';
    descriptionInput.value = 'Test request description details';

    expect(titleInput.value).toBe('Test Request Title');
    expect(descriptionInput.value).toBe('Test request description details');
  });

  it('Request type selection works', () => {
    const requestType = document.getElementById('requestType');
    const options = requestType.querySelectorAll('option');
    
    expect(requestType).toBeTruthy();
    expect(options.length).toBe(3); 
    expect(options[1].value).toBe('service');
    expect(options[2].value).toBe('incident');
  });

  it('Request category has all options', () => {
    const requestCategory = document.getElementById('requestCategory');
    const optgroups = requestCategory.querySelectorAll('optgroup');
    
    expect(requestCategory).toBeTruthy();
    expect(optgroups.length).toBe(3); 
  });

  it('All fields are required', () => {
    const requiredFields = ['Title', 'requestType', 'requestCategory', 'description'];
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      expect(field.hasAttribute('required')).toBe(true);
    });
  });

  it('Description has character guidance', () => {
    const description = document.getElementById('description');
    const formText = document.querySelector('.form-text');
    
    expect(description).toBeTruthy();
    expect(formText.textContent).toContain('Do not share sensitive personal information');
  });
});

