describe('City Sprouts - Homepage', function() {
  it('should have a title', function() {
    browser.get('http://localhost:8080');
    expect(browser.getTitle()).toEqual('City Sprouts');
  });
  
  it('should have a Search form', () => {
    browser.get('http://localhost:8080')
    const searchInput = element(by.id('searchTextField'))
    expect(searchInput.isDisplayed()).toBe(true)
  })
  
  xit('it should have a User Signup button', () => {

  })
  
  xit('it should have a User Signin button', () => {

  })
});
