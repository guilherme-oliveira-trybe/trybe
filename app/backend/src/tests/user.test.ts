import * as chai from 'chai';
import * as Sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import Users from '../database/models/User';

chai.use(chaiHttp);

describe('Rota /login', () =>{
  describe('POST', () => {
    before(() => {
      Sinon.stub(Users, 'findOne').resolves({
        id: 1,
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
      } as Users)
    })

    after(() => {
      (Users.findOne as Sinon.SinonStub).restore();
    })

    it('Retorna status 200 e contém a propriedade token', async () => {
      const response = await chai.request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'secret_admin'});

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response).to.have.property('token');
    })
  })

  describe('GET', () => {
    before(() => {
      Sinon.stub(Users, 'findOne').resolves({
        role: 'admin',
      } as Users)
    })

    after(() => {
      (Users.findOne as Sinon.SinonStub).restore();
    })

    it('Retorna status 200 e contém a propriedade role', async () => {
      const response = await chai.request(app)
      .get('/login/validate')
      .send({ email: 'admin@admin.com' })
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2NDgxNzUwNywiZXhwIjoxNjY0OTAzOTA3fQ.mSEK9ndX-k4i85QDOsk0TSnjgkQM6S-lKKsmstdQJ-8');

      chai.expect(response.status).to.be.equal(200);
      chai.expect(response).to.have.property('role');
    })
  })
})