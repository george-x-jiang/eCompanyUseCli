import { ECompanyUseCliPage } from './app.po';

describe('e-company-use-cli App', () => {
  let page: ECompanyUseCliPage;

  beforeEach(() => {
    page = new ECompanyUseCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
